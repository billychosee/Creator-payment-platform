import { NextRequest, NextResponse } from 'next/server';
import { SecurityUtils } from './security';
import { CSRFProtection, extractSessionId } from './csrf';

// Session and authentication management
export class SecureAuth {
  private static readonly SESSION_COOKIE_NAME = 'session-id';
  private static readonly TOKEN_COOKIE_NAME = 'auth-token';
  private static readonly SESSION_TTL = 24 * 60 * 60 * 1000; // 24 hours
  private static readonly REMEMBER_ME_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days
  private static readonly MAX_LOGIN_ATTEMPTS = 5;
  private static readonly LOGIN_BLOCK_TIME = 15 * 60 * 1000; // 15 minutes

  // In-memory session store (in production, use Redis or database)
  private static sessionStore = new Map<string, {
    userId: string;
    email: string;
    createdAt: number;
    lastAccessed: number;
    expiresAt: number;
    ipAddress: string;
    userAgent: string;
  }>();

  // Failed login attempts tracking
  private static loginAttempts = new Map<string, {
    attempts: number;
    blockedUntil?: number;
    lastAttempt: number;
  }>();

  /**
   * Create a secure session
   */
  static createSession(
    userId: string,
    email: string,
    request: NextRequest,
    rememberMe: boolean = false
  ): { sessionId: string; token: string } {
    const sessionId = SecurityUtils.generateSecureToken(32);
    const token = SecurityUtils.generateSecureToken(64);
    const now = Date.now();
    const ttl = rememberMe ? this.REMEMBER_ME_TTL : this.SESSION_TTL;

    // Store session data
    this.sessionStore.set(sessionId, {
      userId,
      email,
      createdAt: now,
      lastAccessed: now,
      expiresAt: now + ttl,
      ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1',
      userAgent: request.headers.get('user-agent') || 'unknown',
    });

    return { sessionId, token };
  }

  /**
   * Validate session
   */
  static validateSession(sessionId: string): {
    isValid: boolean;
    userId?: string;
    email?: string;
    reason?: string;
  } {
    const session = this.sessionStore.get(sessionId);
    
    if (!session) {
      return { isValid: false, reason: 'Session not found' };
    }

    const now = Date.now();
    
    // Check if session has expired
    if (now > session.expiresAt) {
      this.sessionStore.delete(sessionId);
      return { isValid: false, reason: 'Session has expired' };
    }

    // Update last accessed time
    session.lastAccessed = now;
    
    return {
      isValid: true,
      userId: session.userId,
      email: session.email,
    };
  }

  /**
   * Refresh session
   */
  static refreshSession(sessionId: string): { success: boolean; newExpiry?: number } {
    const session = this.sessionStore.get(sessionId);
    
    if (!session) {
      return { success: false };
    }

    const now = Date.now();
    session.lastAccessed = now;
    session.expiresAt = now + this.SESSION_TTL;

    return { 
      success: true, 
      newExpiry: session.expiresAt 
    };
  }

  /**
   * Destroy session
   */
  static destroySession(sessionId: string): void {
    this.sessionStore.delete(sessionId);
  }

  /**
   * Create authentication response with secure cookies
   */
  static createAuthResponse(
    userId: string,
    email: string,
    request: NextRequest,
    rememberMe: boolean = false
  ): NextResponse {
    const { sessionId, token } = this.createSession(userId, email, request, rememberMe);
    
    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful',
      user: { id: userId, email },
      sessionId,
    });

    // Set session cookie
    response.cookies.set({
      name: this.SESSION_COOKIE_NAME,
      value: sessionId,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: rememberMe ? this.REMEMBER_ME_TTL / 1000 : this.SESSION_TTL / 1000,
      path: '/',
    });

    // Set auth token cookie (for API authentication)
    response.cookies.set({
      name: this.TOKEN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: rememberMe ? this.REMEMBER_ME_TTL / 1000 : this.SESSION_TTL / 1000,
      path: '/api',
    });

    // Add security headers
    response.headers.set('X-Session-ID', sessionId);
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  }

  /**
   * Create logout response
   */
  static createLogoutResponse(sessionId: string): NextResponse {
    // Destroy session
    this.destroySession(sessionId);
    
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

    // Clear all auth cookies
    response.cookies.set({
      name: this.SESSION_COOKIE_NAME,
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    });

    response.cookies.set({
      name: this.TOKEN_COOKIE_NAME,
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/api',
    });

    return response;
  }

  /**
   * Check login rate limiting
   */
  static checkLoginRateLimit(identifier: string): {
    allowed: boolean;
    remaining?: number;
    blockedUntil?: number;
  } {
    const now = Date.now();
    const attempts = this.loginAttempts.get(identifier);

    if (!attempts) {
      return { allowed: true };
    }

    // Check if still blocked
    if (attempts.blockedUntil && now < attempts.blockedUntil) {
      return {
        allowed: false,
        blockedUntil: attempts.blockedUntil,
      };
    }

    // Reset if block time has passed
    if (attempts.blockedUntil && now >= attempts.blockedUntil) {
      this.loginAttempts.delete(identifier);
      return { allowed: true };
    }

    const remaining = this.MAX_LOGIN_ATTEMPTS - attempts.attempts;
    
    if (remaining <= 0) {
      // Block the account
      attempts.blockedUntil = now + this.LOGIN_BLOCK_TIME;
      this.loginAttempts.set(identifier, attempts);
      
      return {
        allowed: false,
        blockedUntil: attempts.blockedUntil,
      };
    }

    return { allowed: true, remaining };
  }

  /**
   * Record failed login attempt
   */
  static recordFailedLogin(identifier: string): void {
    const now = Date.now();
    const attempts = this.loginAttempts.get(identifier) || {
      attempts: 0,
      lastAttempt: 0,
    };

    attempts.attempts++;
    attempts.lastAttempt = now;
    
    this.loginAttempts.set(identifier, attempts);
  }

  /**
   * Reset login attempts on successful login
   */
  static resetLoginAttempts(identifier: string): void {
    this.loginAttempts.delete(identifier);
  }

  /**
   * Get session information
   */
  static getSessionInfo(sessionId: string): any {
    return this.sessionStore.get(sessionId);
  }

  /**
   * Clean up expired sessions and old login attempts
   */
  static cleanup(): void {
    const now = Date.now();
    
    // Clean up expired sessions
    for (const [sessionId, session] of this.sessionStore.entries()) {
      if (now > session.expiresAt) {
        this.sessionStore.delete(sessionId);
      }
    }

    // Clean up old login attempts
    for (const [identifier, attempts] of this.loginAttempts.entries()) {
      if (attempts.blockedUntil && now > attempts.blockedUntil) {
        this.loginAttempts.delete(identifier);
      }
    }
  }

  /**
   * Extract authentication information from request
   */
  static extractAuth(request: NextRequest): {
    sessionId?: string;
    token?: string;
    isAuthenticated: boolean;
    userId?: string;
    email?: string;
  } {
    const sessionId = request.cookies.get(this.SESSION_COOKIE_NAME)?.value;
    const token = request.cookies.get(this.TOKEN_COOKIE_NAME)?.value;

    if (!sessionId) {
      return { isAuthenticated: false };
    }

    const validation = this.validateSession(sessionId);
    
    if (!validation.isValid) {
      return { isAuthenticated: false };
    }

    return {
      sessionId,
      token,
      isAuthenticated: true,
      userId: validation.userId,
      email: validation.email,
    };
  }

  /**
   * Middleware for authentication
   */
  static requireAuth(
    request: NextRequest,
    callback: (request: NextRequest, auth: any) => Promise<NextResponse>
  ): Promise<NextResponse> {
    const auth = this.extractAuth(request);
    
    if (!auth.isAuthenticated) {
      return Promise.resolve(
        NextResponse.json(
          { 
            error: 'Authentication required',
            message: 'Please log in to access this resource',
            timestamp: new Date().toISOString()
          },
          { status: 401 }
        )
      );
    }

    return callback(request, auth);
  }
}

/**
 * Password utilities
 */
export class PasswordUtils {
  /**
   * Hash password using Web Crypto API
   */
  static async hashPassword(password: string, salt?: string): Promise<{ hash: string; salt: string }> {
    const actualSalt = salt || SecurityUtils.generateSecureToken(16);
    const encoder = new TextEncoder();
    const data = encoder.encode(password + actualSalt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return { hash, salt: actualSalt };
  }

  /**
   * Verify password against hash
   */
  static async verifyPassword(password: string, hash: string, salt: string): Promise<boolean> {
    const { hash: computedHash } = await this.hashPassword(password, salt);
    return computedHash === hash;
  }

  /**
   * Generate secure password
   */
  static generatePassword(length: number = 16): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    
    return password;
  }

  /**
   * Validate password strength
   */
  static validatePasswordStrength(password: string): {
    isValid: boolean;
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('Password should be at least 8 characters long');
    }

    if (password.length >= 12) {
      score += 1;
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Password should contain lowercase letters');
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Password should contain uppercase letters');
    }

    if (/[0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Password should contain numbers');
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Password should contain special characters');
    }

    // Check for common patterns
    if (!/(.)\1{2,}/.test(password)) {
      score += 1;
    } else {
      feedback.push('Password should not contain repeated characters');
    }

    return {
      isValid: score >= 5,
      score,
      feedback,
    };
  }
}

/**
 * Authentication middleware
 */
export function withAuth(
  handler: (request: NextRequest, auth: any) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    return await SecureAuth.requireAuth(request, handler);
  };
}

/**
 * Optional authentication middleware (doesn't require auth)
 */
export function withOptionalAuth(
  handler: (request: NextRequest, auth?: any) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const auth = SecureAuth.extractAuth(request);
    return await handler(request, auth.isAuthenticated ? auth : undefined);
  };
}