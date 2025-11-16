"use client";

import { useState, useEffect } from "react";
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
import { CheckCircle, XCircle, Loader, ArrowLeft } from "lucide-react";

interface VerificationResult {
  success: boolean;
  message: string;
  userData?: any;
}

export default function VerifyOTPPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // Get user email from localStorage or URL params
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUserEmail(userData.email);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and limit to 6 digits
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    setOtpCode(numericValue);
    
    if (errors.otp) {
      setErrors({});
    }
  };

  const verifyOTP = async () => {
    if (!otpCode || otpCode.length !== 6) {
      setErrors({ otp: "Please enter a valid 6-digit code" });
      return;
    }

    setIsLoading(true);

    try {
      // Get stored user data
      const storedUser = localStorage.getItem("user");
      
      if (!storedUser) {
        setErrors({ otp: "User data not found. Please register again." });
        setIsLoading(false);
        return;
      }

      const userData = JSON.parse(storedUser);
      
      // Check if OTP is expired
      if (Date.now() > userData.otpExpiry) {
        setErrors({ otp: "OTP code has expired. Please request a new one." });
        setIsLoading(false);
        return;
      }
      
      // Verify OTP code
      if (userData.otpCode === otpCode) {
        // Mark email as verified
        const updatedUserData = {
          ...userData,
          isEmailVerified: true,
          otpCode: null, // Remove OTP after successful verification
          otpExpiry: null,
          verifiedAt: new Date().toISOString(),
        };
        
        localStorage.setItem("user", JSON.stringify(updatedUserData));
        localStorage.removeItem("pendingVerification");
        
        // Redirect to success page with user data
        router.push(`/verify-email?success=true&name=${encodeURIComponent(userData.firstName)}`);
      } else {
        setErrors({ otp: "Invalid OTP code. Please check your email and try again." });
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setErrors({ otp: "An error occurred during verification. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    router.push("/signup");
  };

  const handleResendOTP = async () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      
      // Generate new OTP
      const newOTP = Math.floor(100000 + Math.random() * 900000).toString();
      const updatedUserData = {
        ...userData,
        otpCode: newOTP,
        otpExpiry: Date.now() + (10 * 60 * 1000), // 10 minutes expiry
      };
      
      localStorage.setItem("user", JSON.stringify(updatedUserData));
      
      // Send new OTP email (simulated)
      console.log("Sending new OTP to:", userData.email);
      alert(`New OTP code would be sent to ${userData.email}\n\nFor demo purposes, your new code is: ${newOTP}`);
      
      // Clear current OTP input
      setOtpCode("");
      setErrors({});
    }
  };

  const isOTPExpired = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      return Date.now() > userData.otpExpiry;
    }
    return true;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-2xl">
            CP
          </div>
          <CardTitle>Enter Verification Code</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to <strong>{userEmail}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Input
              label="Verification Code"
              value={otpCode}
              onChange={handleInputChange}
              placeholder="Enter 6-digit code"
              error={errors.otp}
              maxLength={6}
              className="text-center text-lg font-mono tracking-widest"
            />
            
            {isOTPExpired() && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Code expired!</strong> Please request a new one.
                </p>
              </div>
            )}
          </div>

          {errors.otp && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">{errors.otp}</p>
            </div>
          )}

          <div className="space-y-3">
            <Button 
              onClick={verifyOTP} 
              isLoading={isLoading}
              disabled={otpCode.length !== 6 || isOTPExpired()}
              className="w-full"
            >
              {isLoading ? "Verifying..." : "Verify Code"}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleResendOTP}
              className="w-full"
            >
              Resend OTP Code
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={handleGoBack}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Registration
            </Button>
          </div>

          <div className="text-center text-xs text-muted-foreground pt-4 border-t">
            <p>© 2025 CreatorPay. All rights reserved.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}