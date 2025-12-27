"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { ArrowLeft, Mail, Loader } from "lucide-react";

interface ForgotPasswordFormProps {
  onSuccess?: () => void;
}

export const ForgotPasswordForm = ({ onSuccess }: ForgotPasswordFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [emailSent, setEmailSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // Import API service
      const APIService = await import("@/services/api");

      // Initiate forgot password process
      const response = await APIService.initiateForgotPassword(email);

      if (response.success) {
        setEmailSent(true);
        if (onSuccess) onSuccess();
      } else {
        setErrors({ submit: response.error || "Failed to send reset email" });
      }
    } catch (error) {
      console.error("Forgot password failed:", error);
      setErrors({ submit: "Something went wrong. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.push("/login");
  };

  // Show success message after email is sent
  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <img
              src="/Tese-Icon.png"
              alt="Tese Icon"
              className="mx-auto mb-4 w-16 h-16"
            />
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle>Check Your Email</CardTitle>
            <CardDescription>
              We've sent a password reset code to:
              <br />
              <span className="font-medium text-foreground">{email}</span>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 text-center">
            <p className="text-sm text-muted-foreground">
              Enter the 6-digit verification code from your email to reset your
              password. If you don't see the email, check your spam folder.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800 font-medium">
                <strong>Next Step:</strong> Copy the 6-digit code from your
                email and continue with the password reset process.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() =>
                  router.push(
                    `/verify-otp?email=${encodeURIComponent(
                      email
                    )}&type=password-reset`
                  )
                }
                className="w-full"
              >
                Enter Verification Code
              </Button>

              <Button
                variant="gradient"
                onClick={() => setEmailSent(false)}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Send to Different Email
              </Button>

              <Button
                variant="gradient"
                onClick={handleBackToLogin}
                className="w-full"
              >
                Back to Login
              </Button>
            </div>

            <div className="text-center text-xs text-muted-foreground pt-4 border-t">
              <p>© 2025 Tese. All rights reserved.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <img
            src="/Tese-Icon.png"
            alt="Tese Icon"
            className="mx-auto mb-4 w-16 h-16"
          />
          <CardTitle>Forgot Password?</CardTitle>
          <CardDescription>
            No worries! Enter your email address and we'll send you a
            verification code to reset your password.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter your email address"
              error={errors.email}
              required
            />

            {errors.submit && (
              <p className="text-sm text-destructive">{errors.submit}</p>
            )}

            <Button type="submit" isLoading={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Sending Code...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Send Reset Code
                </>
              )}
            </Button>
          </form>

          <div className="space-y-3">
            <Button
              variant="gradient"
              onClick={handleBackToLogin}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
          </div>

          <div className="text-center text-xs text-muted-foreground pt-4 border-t">
            <p>© 2025 Tese. All rights reserved.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
