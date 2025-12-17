import { NextRequest, NextResponse } from 'next/server';
import { CSRFProtection } from '@/lib/csrf';

export async function GET(request: NextRequest) {
  try {
    // Extract or generate session ID
    const sessionId = request.cookies.get('session-id')?.value || 
                     request.headers.get('authorization')?.replace('Bearer ', '') ||
                     `${request.headers.get('x-forwarded-for') || '127.0.0.1'}:${request.headers.get('user-agent') || ''}`;

    // Generate CSRF token
    const response = CSRFProtection.createTokenResponse(sessionId);
    
    // Add additional security headers
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error('CSRF token generation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate CSRF token',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  // Handle preflight requests
  const response = new NextResponse(null, { status: 200 });
  
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, X-CSRF-Token, Authorization');
  response.headers.set('Access-Control-Max-Age', '86400');
  
  return response;
}