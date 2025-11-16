"use client";

import { Suspense } from "react";
import VerifyOTPClient from "./verify-otp-client.tsx";

export const dynamic = 'force-dynamic';

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <VerifyOTPClient />
    </Suspense>
  );
}