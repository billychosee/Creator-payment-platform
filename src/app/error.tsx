'use client';

import { useEffect } from 'react';
import { SecurityUtils } from '@/lib/security';
import { SecurityLogger, SecurityEventType } from '@/lib/securityLogger';
import Link from 'next/link';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log the error securely without exposing sensitive information
    const errorId = SecurityUtils.generateSecureToken(8);
    
    SecurityLogger.log({
      type: SecurityEventType.CONFIGURATION_ERROR,
      severity: 'medium',
      source: {
        ip: 'unknown', // Client-side, IP not available
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
      },
      target: {
        path: typeof window !== 'undefined' ? window.location.pathname : 'unknown',
        method: 'GET',
      },
      details: {
        message: `Client-side error: ${error.message.substring(0, 100)}...`,
        data: {
          errorId,
          digest: error.digest ? 'present' : 'missing',
          timestamp: new Date().toISOString(),
        },
      },
      risk: {
        score: 30,
        factors: ['client_error', 'error_boundary'],
      },
      response: {
        statusCode: 500,
        action: 'error_handled',
      },
    });

    console.error(`Error ID: ${errorId} - This error has been logged securely`);
  }, [error]);

  const handleReset = () => {
    // Clear any potentially corrupted state
    if (typeof window !== 'undefined') {
      // Clear localStorage items that might be corrupted
      const keysToClear = Object.keys(localStorage).filter(key => 
        key.startsWith('user_') || 
        key.startsWith('session_') || 
        key.startsWith('auth_')
      );
      
      keysToClear.forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch (e) {
          // Ignore errors when clearing storage
        }
      });
    }
    
    reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Something went wrong
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We encountered an unexpected error. Our team has been notified.
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <div className="rounded-md bg-yellow-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Security Notice
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    No sensitive information was exposed. This error has been logged for security monitoring.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <button
              onClick={handleReset}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Try again
            </button>
            
            <Link
              href="/"
              className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Go back home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}