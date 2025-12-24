"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { ArrowLeft, Loader, Mail } from "lucide-react";

interface OTPVerificationProps {
  email: string;
  onSuccess: (name: string) => void;
  onBack: () => void;
}

export default function VerifyOTPClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Get email from search params or use default
  const email = searchParams.get("email") || "user@example.com";

  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow digits
    if (value.length <= 6) {
      setOtp(value);
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      setError("Please enter a 6-digit verification code");
      return;
    }

    setIsLoading(true);
    setError("");

    // Simulate OTP verification
    try {
      // In a real app, this would call your API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful verification for demo
      if (otp === "123456") {
        const name = searchParams.get("name") || "User";
        router.push(`/verify-email?success=true&name=${encodeURIComponent(name)}`);
      } else {
        setError("Invalid verification code. Please try again.");
      }
    } catch (err) {
      setError("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      // Simulate resending code
      await new Promise(resolve => setTimeout(resolve, 1500));
      // In a real app, this would call your API to resend the code
    } catch (err) {
      setError("Failed to resend code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <img src="/Tese-Icon.png" alt="Tese" className="mx-auto mb-4 w-16 h-16" />
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle>Verify Your Email</CardTitle>
          <CardDescription>
            We've sent a 6-digit verification code to:
            <br />
            <span className="font-medium text-foreground">{email}</span>
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="otp" className="text-sm font-medium">
                Enter verification code
              </label>
              <Input
                id="otp"
                type="text"
                placeholder="123456"
                value={otp}
                onChange={handleOTPChange}
                className="text-center text-lg font-mono tracking-widest"
                maxLength={6}
                disabled={isLoading}
              />
              {error && (
                <p className="text-sm text-red-600 text-center">{error}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={otp.length !== 6 || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Code"
              )}
            </Button>
          </form>

          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleResendCode}
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Resend Code"}
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full" 
              onClick={() => router.push("/signup")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Registration
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
