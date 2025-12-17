import { NextRequest, NextResponse } from 'next/server';
import { SecurityLogger, SecurityEventType } from '@/lib/securityLogger';
import { SecurityUtils } from '@/lib/security';

// Global error handler for API routes
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { error, context } = body;

    // Log the error securely
    const errorId = SecurityUtils.generateSecureToken(8);
    
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
        message: `API Error: ${error?.message || 'Unknown error'}`,
        data: {
          errorId,
          context: context ? 'provided' : 'missing',
          timestamp: new Date().toISOString(),
        },
      },
      risk: {
        score: 40,
        factors: ['api_error', 'server_side'],
      },
      response: {
        statusCode: 500,
        action: 'error_logged',
      },
    });

    // Return generic error response
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An error occurred while processing your request',
        errorId,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  } catch (err) {
    // If error logging fails, return basic error
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Handle preflight requests
export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 200 });
  
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return response;
}