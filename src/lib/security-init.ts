import { EnvironmentValidator } from './envValidator';
import { SecurityLogger, SecurityEventType } from './securityLogger';
import { SecureAuth } from './auth';

// Security initialization module
export class SecurityInitializer {
  private static initialized = false;

  /**
   * Initialize all security features
   */
  static async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      console.log('🔒 Initializing security features...');

      // 1. Validate environment variables
      const envResult = EnvironmentValidator.validateEnvironment();
      if (!envResult.isValid) {
        console.error('❌ Environment validation failed:', envResult.errors);
        throw new Error('Environment validation failed');
      }

      if (envResult.warnings.length > 0) {
        console.warn('⚠️ Environment validation warnings:', envResult.warnings);
      }

      // 2. Initialize security logging
      await this.initializeSecurityLogging();

      // 3. Initialize session cleanup
      this.initializeSessionCleanup();

      // 4. Log successful initialization
      SecurityLogger.log({
        type: SecurityEventType.CONFIGURATION_ERROR,
        severity: 'low',
        source: {
          ip: 'server',
          userAgent: 'security-initializer',
        },
        target: {
          path: '/security-initialization',
          method: 'POST',
        },
        details: {
          message: 'Security features initialized successfully',
          data: {
            nodeEnv: process.env.NODE_ENV,
            timestamp: new Date().toISOString(),
          },
        },
        risk: {
          score: 0,
          factors: ['initialization'],
        },
        response: {
          statusCode: 200,
          action: 'initialized',
        },
      });

      console.log('✅ Security features initialized successfully');
      this.initialized = true;

    } catch (error) {
      console.error('❌ Security initialization failed:', error);
      
      SecurityLogger.log({
        type: SecurityEventType.CONFIGURATION_ERROR,
        severity: 'critical',
        source: {
          ip: 'server',
          userAgent: 'security-initializer',
        },
        target: {
          path: '/security-initialization',
          method: 'POST',
        },
        details: {
          message: `Security initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          data: {
            error: error instanceof Error ? error.stack : String(error),
            timestamp: new Date().toISOString(),
          },
        },
        risk: {
          score: 100,
          factors: ['initialization_failure', 'critical_error'],
        },
        response: {
          statusCode: 500,
          action: 'initialization_failed',
        },
      });

      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      }
    }
  }

  /**
   * Initialize security logging
   */
  private static async initializeSecurityLogging(): Promise<void> {
    // Set up periodic cleanup of old log entries
    setInterval(() => {
      SecurityLogger.cleanup(30); // Keep logs for 30 days
    }, 24 * 60 * 60 * 1000); // Run daily

    // Log system startup
    SecurityLogger.log({
      type: SecurityEventType.CONFIGURATION_ERROR,
      severity: 'low',
      source: {
        ip: 'server',
        userAgent: 'system-startup',
      },
      target: {
        path: '/system-startup',
        method: 'GET',
      },
      details: {
        message: 'Application started successfully',
        data: {
          nodeEnv: process.env.NODE_ENV,
          timestamp: new Date().toISOString(),
        },
      },
      risk: {
        score: 0,
        factors: ['system_startup'],
      },
      response: {
        statusCode: 200,
        action: 'started',
      },
    });
  }

  /**
   * Initialize session cleanup
   */
  private static initializeSessionCleanup(): void {
    // Clean up expired sessions and login attempts every 30 minutes
    setInterval(() => {
      SecureAuth.cleanup();
    }, 30 * 60 * 1000);

    console.log('🧹 Session cleanup initialized');
  }

  /**
   * Get security status
   */
  static getStatus(): {
    initialized: boolean;
    environment: ReturnType<typeof EnvironmentValidator.getEnvironmentInfo>;
    statistics: ReturnType<typeof SecurityLogger.getStatistics>;
  } {
    return {
      initialized: this.initialized,
      environment: EnvironmentValidator.getEnvironmentInfo(),
      statistics: SecurityLogger.getStatistics({ hours: 24 }),
    };
  }

  /**
   * Check if security is properly configured
   */
  static checkConfiguration(): {
    isSecure: boolean;
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check environment
    const envResult = EnvironmentValidator.validateEnvironment();
    if (!envResult.isValid) {
      issues.push(...envResult.errors);
    }

    // Check Node.js version
    const nodeVersion = process.version;
    if (parseInt(nodeVersion.slice(1).split('.')[0]) < 18) {
      issues.push(`Node.js version ${nodeVersion} is too old (minimum: 18.0.0)`);
    }

    // Check for production-specific issues
    if (process.env.NODE_ENV === 'production') {
      if (process.env.NEXT_PUBLIC_DEBUG_MODE === 'true') {
        issues.push('Debug mode enabled in production');
      }

      if (!process.env.NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET.length < 32) {
        issues.push('NEXTAUTH_SECRET is missing or too short');
      }

      if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
        issues.push('JWT_SECRET is missing or too short');
      }
    }

    // Generate recommendations
    if (process.env.NODE_ENV === 'production') {
      recommendations.push('Enable HTTPS and HSTS headers');
      recommendations.push('Set up security monitoring and alerting');
      recommendations.push('Regularly update dependencies');
      recommendations.push('Implement rate limiting');
      recommendations.push('Use environment-specific configurations');
    }

    return {
      isSecure: issues.length === 0,
      issues,
      recommendations,
    };
  }
}

// Auto-initialize in server-side contexts
if (typeof window === 'undefined') {
  // Server-side initialization
  SecurityInitializer.initialize().catch(error => {
    console.error('Failed to initialize security:', error);
  });
}

export default SecurityInitializer;