import { NextRequest, NextResponse } from 'next/server';
import { SecurityUtils } from './security';

// Security event types
export enum SecurityEventType {
  AUTHENTICATION_SUCCESS = 'authentication_success',
  AUTHENTICATION_FAILURE = 'authentication_failure',
  AUTHORIZATION_FAILURE = 'authorization_failure',
  CSRF_VALIDATION_FAILURE = 'csrf_validation_failure',
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  SUSPICIOUS_INPUT = 'suspicious_input',
  SQL_INJECTION_ATTEMPT = 'sql_injection_attempt',
  XSS_ATTEMPT = 'xss_attempt',
  BRUTE_FORCE_ATTEMPT = 'brute_force_attempt',
  UNAUTHORIZED_ACCESS = 'unauthorized_access',
  SESSION_ANOMALY = 'session_anomaly',
  CONFIGURATION_ERROR = 'configuration_error',
  DEPENDENCY_VULNERABILITY = 'dependency_vulnerability',
  SECURITY_HEADER_MISSING = 'security_header_missing',
  UNUSUAL_TRAFFIC = 'unusual_traffic',
  MALICIOUS_IP = 'malicious_ip',
  BOT_DETECTED = 'bot_detected',
  FILE_UPLOAD_RISK = 'file_upload_risk',
  DATA_BREACH_ATTEMPT = 'data_breach_attempt',
}

// Security event interface
export interface SecurityEvent {
  id: string;
  type: SecurityEventType;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: {
    ip: string;
    userAgent: string;
    sessionId?: string;
    userId?: string;
    referer?: string;
  };
  target: {
    path: string;
    method: string;
    resource?: string;
  };
  details: {
    message: string;
    data?: Record<string, any>;
    userAgent?: string;
    headers?: Record<string, string>;
    body?: any;
  };
  risk: {
    score: number; // 0-100
    factors: string[];
  };
  resolved: boolean;
  response?: {
    statusCode: number;
    action: string;
  };
}

// Security logger class
export class SecurityLogger {
  private static events: SecurityEvent[] = [];
  private static readonly MAX_EVENTS = 10000; // Keep last 10k events
  private static readonly ALERT_THRESHOLDS = {
    high: 5, // Alert after 5 high severity events
    critical: 1, // Alert immediately on critical
    rate_limit: 10, // Alert after 10 rate limit violations
    auth_failures: 3, // Alert after 3 auth failures from same IP
  };

  /**
   * Log a security event
   */
  static log(event: Omit<SecurityEvent, 'id' | 'timestamp' | 'resolved'>): string {
    const securityEvent: SecurityEvent = {
      ...event,
      id: SecurityUtils.generateSecureToken(16),
      timestamp: new Date(),
      resolved: false,
    };

    // Add to in-memory store
    this.events.push(securityEvent);
    
    // Keep only the latest events
    if (this.events.length > this.MAX_EVENTS) {
      this.events = this.events.slice(-this.MAX_EVENTS);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[SECURITY] ${event.type.toUpperCase()}: ${event.details.message}`, {
        id: securityEvent.id,
        severity: event.severity,
        source: event.source,
        target: event.target,
        risk: event.risk,
      });
    }

    // Send to external monitoring service (if configured)
    if (process.env.SECURITY_WEBHOOK_URL) {
      this.sendToExternalService(securityEvent);
    }

    // Check for alerts
    this.checkAlertThresholds(securityEvent);

    return securityEvent.id;
  }

  /**
   * Log authentication events
   */
  static logAuthEvent(
    type: SecurityEventType.AUTHENTICATION_SUCCESS | SecurityEventType.AUTHENTICATION_FAILURE,
    success: boolean,
    request: NextRequest,
    userId?: string,
    additionalData?: Record<string, any>
  ): string {
    const ip = this.getClientIP(request);
    const userAgent = request.headers.get('user-agent') || 'unknown';

    return this.log({
      type,
      severity: success ? 'low' : 'medium',
      source: {
        ip,
        userAgent,
        sessionId: request.cookies.get('session-id')?.value,
        userId,
      },
      target: {
        path: request.nextUrl.pathname,
        method: request.method,
      },
      details: {
        message: success ? 'User authenticated successfully' : 'Authentication failed',
        userAgent,
        headers: this.sanitizeHeaders(Object.fromEntries(request.headers.entries())),
        body: this.sanitizeRequestBody(request),
        data: additionalData,
      },
      risk: {
        score: success ? 0 : 30,
        factors: success ? [] : ['authentication_failure'],
      },
      response: {
        statusCode: success ? 200 : 401,
        action: success ? 'grant_access' : 'deny_access',
      },
    });
  }

  /**
   * Log authorization failure
   */
  static logAuthzFailure(
    request: NextRequest,
    reason: string,
    userId?: string
  ): string {
    const ip = this.getClientIP(request);

    return this.log({
      type: SecurityEventType.AUTHORIZATION_FAILURE,
      severity: 'medium',
      source: {
        ip,
        userAgent: request.headers.get('user-agent') || 'unknown',
        sessionId: request.cookies.get('session-id')?.value,
        userId,
      },
      target: {
        path: request.nextUrl.pathname,
        method: request.method,
      },
      details: {
        message: `Authorization failed: ${reason}`,
        userAgent: request.headers.get('user-agent') || 'unknown',
        headers: this.sanitizeHeaders(Object.fromEntries(request.headers.entries())),
      },
      risk: {
        score: 40,
        factors: ['unauthorized_access', reason],
      },
      response: {
        statusCode: 403,
        action: 'deny_access',
      },
    });
  }

  /**
   * Log CSRF validation failure
   */
  static logCSRFfailure(
    request: NextRequest,
    reason: string,
    userId?: string
  ): string {
    const ip = this.getClientIP(request);

    return this.log({
      type: SecurityEventType.CSRF_VALIDATION_FAILURE,
      severity: 'high',
      source: {
        ip,
        userAgent: request.headers.get('user-agent') || 'unknown',
        sessionId: request.cookies.get('session-id')?.value,
        userId,
      },
      target: {
        path: request.nextUrl.pathname,
        method: request.method,
      },
      details: {
        message: `CSRF validation failed: ${reason}`,
        userAgent: request.headers.get('user-agent') || 'unknown',
        headers: this.sanitizeHeaders(Object.fromEntries(request.headers.entries())),
      },
      risk: {
        score: 60,
        factors: ['csrf_validation_failure', 'potential_attack'],
      },
      response: {
        statusCode: 403,
        action: 'deny_access',
      },
    });
  }

  /**
   * Log rate limit exceeded
   */
  static logRateLimitExceeded(
    request: NextRequest,
    identifier: string,
    attempts: number
  ): string {
    const ip = this.getClientIP(request);

    return this.log({
      type: SecurityEventType.RATE_LIMIT_EXCEEDED,
      severity: 'medium',
      source: {
        ip,
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
      target: {
        path: request.nextUrl.pathname,
        method: request.method,
      },
      details: {
        message: `Rate limit exceeded for ${identifier}`,
        data: { attempts, identifier },
      },
      risk: {
        score: 45,
        factors: ['rate_limiting', 'potential_abuse'],
      },
      response: {
        statusCode: 429,
        action: 'rate_limit',
      },
    });
  }

  /**
   * Log suspicious input detection
   */
  static logSuspiciousInput(
    request: NextRequest,
    input: string,
    patterns: string[],
    userId?: string
  ): string {
    const ip = this.getClientIP(request);

    return this.log({
      type: SecurityEventType.SUSPICIOUS_INPUT,
      severity: patterns.some(p => p.includes('script') || p.includes('eval')) ? 'high' : 'medium',
      source: {
        ip,
        userAgent: request.headers.get('user-agent') || 'unknown',
        sessionId: request.cookies.get('session-id')?.value,
        userId,
      },
      target: {
        path: request.nextUrl.pathname,
        method: request.method,
      },
      details: {
        message: `Suspicious input detected: ${patterns.join(', ')}`,
        data: {
          input: input.substring(0, 200), // Truncate for logging
          patterns,
        },
      },
      risk: {
        score: patterns.some(p => p.includes('script') || p.includes('eval')) ? 70 : 50,
        factors: ['suspicious_input', ...patterns],
      },
      response: {
        statusCode: 400,
        action: 'reject_input',
      },
    });
  }

  /**
   * Log brute force attempt
   */
  static logBruteForceAttempt(
    request: NextRequest,
    target: string,
    attempts: number,
    userId?: string
  ): string {
    const ip = this.getClientIP(request);

    return this.log({
      type: SecurityEventType.BRUTE_FORCE_ATTEMPT,
      severity: 'high',
      source: {
        ip,
        userAgent: request.headers.get('user-agent') || 'unknown',
        userId,
      },
      target: {
        path: request.nextUrl.pathname,
        method: request.method,
        resource: target,
      },
      details: {
        message: `Brute force attempt detected: ${attempts} attempts`,
        data: { attempts, target },
      },
      risk: {
        score: 80,
        factors: ['brute_force', 'multiple_attempts', target],
      },
      response: {
        statusCode: 429,
        action: 'block_ip',
      },
    });
  }

  /**
   * Log session anomaly
   */
  static logSessionAnomaly(
    request: NextRequest,
    sessionId: string,
    anomaly: string,
    userId?: string
  ): string {
    const ip = this.getClientIP(request);

    return this.log({
      type: SecurityEventType.SESSION_ANOMALY,
      severity: 'medium',
      source: {
        ip,
        userAgent: request.headers.get('user-agent') || 'unknown',
        sessionId,
        userId,
      },
      target: {
        path: request.nextUrl.pathname,
        method: request.method,
      },
      details: {
        message: `Session anomaly detected: ${anomaly}`,
        data: { anomaly },
      },
      risk: {
        score: 55,
        factors: ['session_anomaly', anomaly],
      },
      response: {
        statusCode: 401,
        action: 'invalidate_session',
      },
    });
  }

  /**
   * Get security events with filtering
   */
  static getEvents(filters: {
    type?: SecurityEventType;
    severity?: 'low' | 'medium' | 'high' | 'critical';
    source?: string;
    target?: string;
    since?: Date;
    limit?: number;
  } = {}): SecurityEvent[] {
    let filteredEvents = [...this.events];

    if (filters.type) {
      filteredEvents = filteredEvents.filter(e => e.type === filters.type);
    }

    if (filters.severity) {
      filteredEvents = filteredEvents.filter(e => e.severity === filters.severity);
    }

    if (filters.source) {
      filteredEvents = filteredEvents.filter(e => e.source.ip.includes(filters.source!));
    }

    if (filters.target) {
      filteredEvents = filteredEvents.filter(e => e.target.path.includes(filters.target!));
    }

    if (filters.since) {
      filteredEvents = filteredEvents.filter(e => e.timestamp >= filters.since!);
    }

    // Sort by timestamp (newest first)
    filteredEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Apply limit
    if (filters.limit) {
      filteredEvents = filteredEvents.slice(0, filters.limit);
    }

    return filteredEvents;
  }

  /**
   * Get security statistics
   */
  static getStatistics(timeRange: { hours?: number } = {}): {
    total: number;
    byType: Record<SecurityEventType, number>;
    bySeverity: Record<string, number>;
    topSources: Array<{ ip: string; count: number }>;
    recentAlerts: SecurityEvent[];
  } {
    const since = timeRange.hours 
      ? new Date(Date.now() - timeRange.hours * 60 * 60 * 1000)
      : new Date(0);

    const relevantEvents = this.getEvents({ since });

    const byType = relevantEvents.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<SecurityEventType, number>);

    const bySeverity = relevantEvents.reduce((acc, event) => {
      acc[event.severity] = (acc[event.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topSources = relevantEvents.reduce((acc, event) => {
      const existing = acc.find(item => item.ip === event.source.ip);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ ip: event.source.ip, count: 1 });
      }
      return acc;
    }, [] as Array<{ ip: string; count: number }>);

    // Sort top sources by count
    topSources.sort((a, b) => b.count - a.count);
    topSources.splice(10); // Keep top 10

    const recentAlerts = relevantEvents.filter(e => 
      e.severity === 'high' || e.severity === 'critical'
    ).slice(0, 5);

    return {
      total: relevantEvents.length,
      byType,
      bySeverity,
      topSources,
      recentAlerts,
    };
  }

  /**
   * Clean up old events
   */
  static cleanup(daysToKeep: number = 30): void {
    const cutoff = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
    this.events = this.events.filter(event => event.timestamp >= cutoff);
  }

  /**
   * Helper methods
   */
  private static getClientIP(request: NextRequest): string {
    return request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
           request.headers.get('x-real-ip') || 
           '127.0.0.1';
  }

  private static sanitizeHeaders(headers: Record<string, string>): Record<string, string> {
    const sanitized: Record<string, string> = {};
    
    for (const [key, value] of Object.entries(headers)) {
      // Skip sensitive headers
      if (key.toLowerCase().includes('authorization') || 
          key.toLowerCase().includes('cookie')) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = value.length > 200 ? value.substring(0, 200) + '...' : value;
      }
    }
    
    return sanitized;
  }

  private static sanitizeRequestBody(request: NextRequest): any {
    try {
      // This is a simplified version - in production, you'd want to handle different content types
      return { sanitized: true, note: 'Request body sanitized for security logging' };
    } catch {
      return { error: 'Could not parse request body' };
    }
  }

  private static async sendToExternalService(event: SecurityEvent): Promise<void> {
    try {
      await fetch(process.env.SECURITY_WEBHOOK_URL!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SECURITY_WEBHOOK_TOKEN || ''}`,
        },
        body: JSON.stringify(event),
      });
    } catch (error) {
      console.error('Failed to send security event to external service:', error);
    }
  }

  private static checkAlertThresholds(event: SecurityEvent): void {
    const recentEvents = this.getEvents({ 
      since: new Date(Date.now() - 60 * 60 * 1000) // Last hour
    });

    const recentHigh = recentEvents.filter(e => e.severity === 'high').length;
    const recentCritical = recentEvents.filter(e => e.severity === 'critical').length;

    if (recentCritical >= this.ALERT_THRESHOLDS.critical) {
      this.triggerAlert('CRITICAL: Multiple critical security events detected', event);
    } else if (recentHigh >= this.ALERT_THRESHOLDS.high) {
      this.triggerAlert('HIGH: Multiple high severity security events detected', event);
    }
  }

  private static triggerAlert(message: string, event: SecurityEvent): void {
    console.error(`[SECURITY ALERT] ${message}`, {
      eventId: event.id,
      type: event.type,
      severity: event.severity,
      source: event.source,
      target: event.target,
    });

    // In production, send alerts via email, Slack, etc.
    if (process.env.ALERT_WEBHOOK_URL) {
      fetch(process.env.ALERT_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alert: message,
          event,
          timestamp: new Date().toISOString(),
        }),
      }).catch(console.error);
    }
  }
}

/**
 * Middleware for automatic security logging
 */
export function withSecurityLogging(
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const startTime = Date.now();
    let response: NextResponse;

    try {
      response = await handler(request);
      
      // Log slow requests
      const duration = Date.now() - startTime;
      if (duration > 5000) { // 5 seconds
        SecurityLogger.log({
          type: SecurityEventType.UNUSUAL_TRAFFIC,
          severity: 'low',
          source: {
            ip: request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1',
            userAgent: request.headers.get('user-agent') || 'unknown',
          },
          target: {
            path: request.nextUrl.pathname,
            method: request.method,
          },
          details: {
            message: `Slow request detected (${duration}ms)`,
            data: { duration },
          },
          risk: {
            score: 20,
            factors: ['slow_request'],
          },
          response: {
            statusCode: response.status,
            action: 'logged',
          },
        });
      }

      return response;
    } catch (error) {
      // Log errors
      SecurityLogger.log({
        type: SecurityEventType.CONFIGURATION_ERROR,
        severity: 'medium',
        source: {
          ip: request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1',
          userAgent: request.headers.get('user-agent') || 'unknown',
        },
        target: {
          path: request.nextUrl.pathname,
          method: request.method,
        },
        details: {
          message: `Request processing error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          data: { error: error instanceof Error ? error.stack : String(error) },
        },
        risk: {
          score: 40,
          factors: ['error', 'processing_failure'],
        },
        response: {
          statusCode: 500,
          action: 'error_handled',
        },
      });

      throw error;
    }
  };
}