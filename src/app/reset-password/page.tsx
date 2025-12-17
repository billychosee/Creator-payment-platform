"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ResetPasswordForm } from "@/components/forms/ResetPasswordForm";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const verified = searchParams.get("verified") === "true";

  return <ResetPasswordForm email={email} verified={verified} />;
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
