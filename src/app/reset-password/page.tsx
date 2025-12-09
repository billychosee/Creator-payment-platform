"use client";

import { useSearchParams } from "next/navigation";
import { ResetPasswordForm } from "@/components/forms/ResetPasswordForm";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const verified = searchParams.get("verified") === "true";

  return <ResetPasswordForm email={email} verified={verified} />;
}