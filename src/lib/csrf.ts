import { NextRequest, NextResponse } from 'next/server';
import { SecurityUtils } from './security';

export class CSRFProtection {
  private static readonly TOKEN_COOKIE_NAME = 'csrf-token';
  private static readonly TOKEN_HEADER_NAME = 'x-csrf-token';
  private static readonly TOKEN_FORM_NAME = '_csrf';
  private static readonly TOKEN_LENGTH = 32;
  private static readonly TOKEN_TTL = 24 * 60 * 60 * 1000;

  private static tokenStore = new Map<string, { token: string; expiresAt: number }>();

  static generateToken(sessionId: string): string {
    const token = SecurityUtils.generateSecureToken(this.TOKEN_LENGTH);
    const expiresAt = Date.now() + this.TOKEN_TTL;
    
    this.tokenStore.set(sessionId, { token, expiresAt });
    this.cleanupExpiredTokens();
    
    return token;
  }

  static getOrCreateToken(sessionId: string): string {
    const existing = this.tokenStore.get(sessionId);
    
    if (!existing || Date.now() > existing.expiresAt) {
      return this.generateToken(sessionId);
    }
    
    return existing.token;
  }

  static validateToken(
    request: NextRequest,
    sessionId: string
  ): { isValid: boolean; reason?: string } {
    const method = request.method.toUpperCase();
    if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      return { isValid: true };
    }

    if (process.env.NODE_ENV === 'development') {
      const origin = request.headers.get('origin');
      const host = request.headers.get('host');
      if (origin && host && origin.includes(host)) {
        return { isValid: true };
      }
    }

    const tokenFromHeader = request.headers.get(this.TOKEN_HEADER_NAME);
    const tokenFromForm = request.headers.get('content-type')?.includes('application/x-www-form-urlencoded') 
      ? null 
      : request.headers.get(this.TOKEN_FORM_NAME);

    const providedToken = tokenFromHeader || tokenFromForm;
    
    if (!providedToken) {
      return { isValid: false, reason: 'CSRF token not provided' };
    }

    const storedToken = this.tokenStore.get(sessionId);
    
    if (!storedToken) {
      return { isValid: false, reason: 'No CSRF token found for session' };
    }

    if (Date.now() > storedToken.expiresAt) {
      this.tokenStore.delete(sessionId);
      return { isValid: false, reason: 'CSRF token has expired' };
    }

    if (providedToken !== storedToken.token) {
      return { isValid: false, reason: 'Invalid CSRF token' };
    }

    return { isValid: true };
  }

  static createTokenResponse(sessionId: string): NextResponse {
    const token = this.generateToken(sessionId);
    
    const response = NextResponse.json({ 
      csrfToken: token,
      expiresAt: Date.now() + this.TOKEN_TTL
    });

    response.cookies.set({
      name: this.TOKEN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: this.TOKEN_TTL / 1000,
      path: '/',
    });

    return response;
  }

  static middleware(
    request: NextRequest,
    sessionId: string,
    callback?: (isValid: boolean, response: NextResponse) => NextResponse
  ): NextResponse | null {
    const validation = this.validateToken(request, sessionId);
    
    if (!validation.isValid) {
      const response = NextResponse.json(
        { 
          error: 'CSRF validation failed',
          message: validation.reason,
          timestamp: new Date().toISOString()
        },
        { status: 403 }
      );
      
      response.headers.set('X-CSRF-Error', validation.reason || 'Unknown error');
      response.headers.set('X-Request-ID', SecurityUtils.generateSecureToken(16));
      
      return callback ? callback(false, response) : response;
    }

    if (callback) {
      const response = NextResponse.next();
      return callback(true, response);
    }

    return null;
  }

  private static cleanupExpiredTokens(): void {
    const now = Date.now();
    for (const [sessionId, tokenData] of this.tokenStore.entries()) {
      if (now > tokenData.expiresAt) {
        this.tokenStore.delete(sessionId);
      }
    }
  }

  static revokeToken(sessionId: string): void {
    this.tokenStore.delete(sessionId);
  }

  static getTokenInfo(sessionId: string): { hasToken: boolean; expiresAt?: number } {
    const tokenData = this.tokenStore.get(sessionId);
    return {
      hasToken: !!tokenData,
      expiresAt: tokenData?.expiresAt
    };
  }
}

export class CSRFClient {
  private static token: string | null = null;

  static async getToken(): Promise<string> {
    if (this.token) {
      return this.token;
    }

    if (typeof document !== 'undefined') {
      const cookieMatch = document.cookie.match(/csrf-token=([^;]+)/);
      if (cookieMatch) {
        this.token = cookieMatch[1];
        return this.token;
      }
    }

    try {
      const response = await fetch('/api/csrf-token', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        this.token = data.csrfToken;
        return this.token;
      }
    } catch (error) {
      console.error('Failed to fetch CSRF token:', error);
    }

    this.token = SecurityUtils.generateSecureToken(32);
    return this.token;
  }

  static async addTokenToRequest(options: RequestInit = {}): Promise<RequestInit> {
    const token = await this.getToken();
    
    return {
      ...options,
      headers: {
        ...options.headers,
        'X-CSRF-Token': token,
      },
    };
  }

  static async createSecureForm(
    action: string,
    method: string = 'POST',
    data: Record<string, any> = {}
  ): Promise<HTMLFormElement> {
    const token = await this.getToken();
    
    const form = document.createElement('form');
    form.action = action;
    form.method = method;
    form.style.display = 'none';

    const csrfInput = document.createElement('input');
    csrfInput.type = 'hidden';
    csrfInput.name = '_csrf';
    csrfInput.value = token;
    form.appendChild(csrfInput);

    for (const [key, value] of Object.entries(data)) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = String(value);
      form.appendChild(input);
    }

    return form;
  }

  static async submitSecureForm(
    action: string,
    method: string = 'POST',
    data: Record<string, any> = {}
  ): Promise<Response> {
    const form = await this.createSecureForm(action, method, data);
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(new Response(JSON.stringify({ success: true }), { status: 200 }));
      }, 100);
    });
  }
}

export function useCSRF() {
  const getToken = async (): Promise<string> => {
    return await CSRFClient.getToken();
  };

  const addTokenToRequest = async (options: RequestInit = {}): Promise<RequestInit> => {
    return await CSRFClient.addTokenToRequest(options);
  };

  const submitSecureForm = async (
    action: string,
    method: string = 'POST',
    data: Record<string, any> = {}
  ): Promise<Response> => {
    return await CSRFClient.submitSecureForm(action, method, data);
  };

  return {
    getToken,
    addTokenToRequest,
    submitSecureForm,
  };
}

export function withCSRF(
  handler: (request: NextRequest, sessionId: string) => Promise<NextResponse>,
  sessionIdExtractor?: (request: NextRequest) => string
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const sessionId = sessionIdExtractor 
      ? sessionIdExtractor(request) 
      : request.cookies.get('session-id')?.value || 'anonymous';

    const csrfResult = CSRFProtection.middleware(request, sessionId);
    if (csrfResult) {
      return csrfResult;
    }

    return await handler(request, sessionId);
  };
}

export function extractSessionId(request: NextRequest): string {
  const sessionCookie = request.cookies.get('session-id')?.value;
  if (sessionCookie) {
    return sessionCookie;
  }

  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const userAgent = request.headers.get('user-agent') || '';
  return `${ip}:${userAgent}`;
}