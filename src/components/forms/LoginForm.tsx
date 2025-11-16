"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ProfileSetupModal } from "@/components/ui/ProfileSetupModal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSetupComplete = (profileData: any) => {
    // Save profile completion status
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    userData.accountType = 'individual';
    userData.profileData = profileData;
    userData.profileCompletedAt = new Date().toISOString();
    userData.hasCompletedProfileSetup = true;
    localStorage.setItem("user", JSON.stringify(userData));
    
    setShowProfileSetup(false);
    router.push("/dashboard");
    if (onSuccess) onSuccess();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Placeholder API call - replace with actual login logic
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Check if user exists in localStorage (in real app, this would be handled by backend)
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        if (userData.email === formData.email) {
          // Check if email is verified
          if (!userData.isEmailVerified) {
            setErrors({
              submit: "Please verify your email address before logging in. Check your email for the verification code and enter it on the OTP verification page."
            });
            return;
          }
          
          // Check password (in production, this would be handled by backend)
          if (userData.password !== formData.password) {
            setErrors({ submit: "Invalid email or password" });
            return;
          }
          
          localStorage.setItem("isLoggedIn", "true");
          
          // Check if user needs to complete profile setup
          if (!userData.hasCompletedProfileSetup) {
            setShowProfileSetup(true);
          } else {
            router.push("/dashboard");
            if (onSuccess) onSuccess();
          }
          return;
        }
      }
      
      setErrors({ submit: "No account found with this email address. Please register first." });
    } catch (error) {
      console.error("Login failed:", error);
      setErrors({ submit: "Login failed. Please check your credentials." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterClick = () => {
    router.push("/signup");
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-2xl">
              CP
            </div>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Login to your CreatorPay account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                error={errors.email}
                required
              />

              <Input
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                error={errors.password}
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
                Login
              </Button>
            </form>

            <div className="text-center">
              <button
                type="button"
                onClick={handleRegisterClick}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Don't have an account? Register
              </button>
            </div>

            <div className="text-center text-xs text-muted-foreground pt-4 border-t">
              <p>© 2025 CreatorPay. All rights reserved.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Setup Modal */}
      <ProfileSetupModal
        isOpen={showProfileSetup}
        userEmail={formData.email}
        onClose={() => {
          // Allow user to skip for now and go to dashboard
          setShowProfileSetup(false);
          router.push("/dashboard");
          if (onSuccess) onSuccess();
        }}
        onComplete={handleProfileSetupComplete}
      />
    </>
  );
};