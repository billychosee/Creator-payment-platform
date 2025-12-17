"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { ForgotPasswordOTPForm } from "@/components/forms/ForgotPasswordOTPForm";
import VerifyOTPClient from "./verify-otp-client";

function VerifyOTPContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const email = searchParams.get("email") || "";

  const [showForgotPasswordFlow, setShowForgotPasswordFlow] = useState(
    type === "password-reset"
  );

  // If this is for password reset, use the forgot password OTP form
  if (showForgotPasswordFlow && email) {
    return (
      <ForgotPasswordOTPForm
        email={email}
        onSuccess={() => console.log("OTP verified for password reset")}
        onBack={() => setShowForgotPasswordFlow(false)}
      />
    );
  }

  // Otherwise, use the existing email verification flow
  return <VerifyOTPClient />;
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOTPContent />
    </Suspense>
  );
}
