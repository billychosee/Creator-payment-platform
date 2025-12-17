'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { SecurityLogger, SecurityEventType } from '@/lib/securityLogger';

export default function NotFound() {
  useEffect(() => {
    // Log 404 errors for security monitoring
    SecurityLogger.log({
      type: SecurityEventType.UNAUTHORIZED_ACCESS,
      severity: 'low',
      source: {
        ip: 'unknown',
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
      },
      target: {
        path: typeof window !== 'undefined' ? window.location.pathname : 'unknown',
        method: 'GET',
      },
      details: {
        message: '404 Not Found - Page not found',
        data: {
          timestamp: new Date().toISOString(),
        },
      },
      risk: {
        score: 10,
        factors: ['404_error', 'page_not_found'],
      },
      response: {
        statusCode: 404,
        action: 'page_not_found',
      },
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <svg
              className="h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291.957-5.656 2.5M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Page not found
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <div className="flex flex-col space-y-4">
            <Link
              href="/"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Go back home
            </Link>
            
            <Link
              href="/dashboard"
              className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Go to dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}