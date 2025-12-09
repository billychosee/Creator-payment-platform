"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { ArrowLeft, Loader, CheckCircle } from "lucide-react";

interface ResetPasswordFormProps {
  email: string;
  verified: boolean;
  onSuccess?: () => void;
}

export const ResetPasswordForm = ({ email, verified, onSuccess }: ResetPasswordFormProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters long";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
      
      // Reset password
      const response = await APIService.resetPassword(email, formData.newPassword);
      
      if (response.success) {
        setIsSuccess(true);
        if (onSuccess) onSuccess();
        
        // Redirect to login after a delay
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setErrors({ submit: response.error || "Failed to reset password" });
      }
    } catch (error) {
      console.error("Password reset failed:", error);
      setErrors({ submit: "Something went wrong. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.push("/login");
  };

  // Check if user came from OTP verification
  if (!verified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <ArrowLeft className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle>Verification Required</CardTitle>
            <CardDescription>
              Please verify your email address first before resetting your password.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 text-center">
            <p className="text-sm text-muted-foreground">
              You need to complete the email verification process before you can reset your password.
            </p>
            
            <div className="space-y-3">
              <Button
                onClick={() => router.push(`/verify-otp?email=${encodeURIComponent(email)}&type=password-reset`)}
                className="w-full"
              >
                Verify Email First
              </Button>
              
              <Button
                variant="ghost"
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

  // Show success message after password reset
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <img src="/Tese-Icon.png" alt="Tese Icon" className="mx-auto mb-4 w-16 h-16" />
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle>Password Reset Successfully!</CardTitle>
            <CardDescription>
              Your password has been updated successfully.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 text-center">
            <p className="text-sm text-muted-foreground">
              You can now login with your new password. You'll be redirected to the login page shortly.
            </p>
            
            <div className="space-y-3">
              <Button
                onClick={handleBackToLogin}
                className="w-full"
              >
                Continue to Login
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
          <img src="/Tese-Icon.png" alt="Tese Icon" className="mx-auto mb-4 w-16 h-16" />
          <CardTitle>Reset Your Password</CardTitle>
          <CardDescription>
            Create a new password for your account:
            <br />
            <span className="font-medium text-foreground">{email}</span>
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="New Password"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter your new password"
              error={errors.newPassword}
              required
            />

            <Input
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your new password"
              error={errors.confirmPassword}
              required
            />

            {errors.submit && (
              <p className="text-sm text-destructive">{errors.submit}</p>
            )}

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Updating Password...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </form>

          <div className="space-y-3">
            <Button
              variant="ghost"
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