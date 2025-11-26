"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { CheckCircle, XCircle, Loader } from "lucide-react";

interface VerificationResult {
  success: boolean;
  message: string;
  userData?: any;
}

export default function VerifyEmailClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  // Handle email verification process
  useEffect(() => {
    const success = searchParams.get("success");
    const name = searchParams.get("name");
    
    if (success === "true" && name) {
      // Update localStorage to mark email as verified
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        userData.isEmailVerified = true;
        userData.verifiedAt = new Date().toISOString();
        localStorage.setItem("user", JSON.stringify(userData));
        
        // Clear pending verification flag
        localStorage.removeItem("pendingVerification");
      }
      
      setVerificationResult({
        success: true,
        message: "Email verified successfully! You can now login to your account.",
        userData: {
          firstName: decodeURIComponent(name),
        },
      });
    } else {
      // For direct access or failed verification links, show error
      setVerificationResult({
        success: false,
        message: "Invalid verification link. Please register again to receive a new verification code.",
      });
      setIsLoading(false);
    }
  }, []);

  const handleLogin = () => {
    router.push("/login");
  };

  const handleGoHome = () => {
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-2xl">
              CP
            </div>
            <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Loader className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            <CardTitle>Verifying Email</CardTitle>
            <CardDescription>
              Please wait while we verify your email address...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!verificationResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-2xl">
              CP
            </div>
            <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle>Verification Failed</CardTitle>
            <CardDescription>
              Unable to process verification
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (verificationResult.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-2xl">
              CP
            </div>
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle>Email Verified Successfully!</CardTitle>
            <CardDescription>
              Welcome to Tese, {verificationResult.userData?.firstName}!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <p className="text-sm text-muted-foreground">
              Your email has been verified and your account is now active.
              You can now login to start using Tese.
            </p>
            
            <div className="space-y-3">
              <Button onClick={handleLogin} className="w-full">
                Login to Your Account
              </Button>
              
              <Button variant="outline" onClick={handleGoHome} className="w-full">
                Go to Homepage
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

  // Verification failed
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-2xl">
            CP
          </div>
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle>Verification Failed</CardTitle>
          <CardDescription>
            Unable to verify your email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-sm text-muted-foreground">
            {verificationResult.message}
          </p>
          
          <div className="space-y-3">
            <Button onClick={() => router.push("/signup")} className="w-full">
              Register Again
            </Button>
            
            <Button variant="outline" onClick={handleLogin} className="w-full">
              Go to Login
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