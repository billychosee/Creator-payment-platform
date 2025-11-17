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

  const handleProfileSetupComplete = async (profileData: any) => {
    try {
      // Import local database
      const { LocalDatabase } = await import("@/services/localDatabase");
      
      // Get current user
      const currentUser = LocalDatabase.getCurrentUser();
      if (currentUser) {
        // Update user with profile completion data
        LocalDatabase.updateUser(currentUser.id, {
          tagline: profileData.tagline || currentUser.tagline,
          bio: profileData.bio || currentUser.bio,
          socialLinks: {
            ...currentUser.socialLinks,
            ...profileData.socialLinks
          }
        });
      }
      
      setShowProfileSetup(false);
      router.push("/dashboard");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Failed to save profile setup:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Import local database
      const { LocalDatabase } = await import("@/services/localDatabase");
      
      // Authenticate user using local database
      const user = LocalDatabase.authenticate(formData.email, formData.password);
      
      if (user) {
        // Check if this is the demo user with no password set yet
        if (user.email === "demo@example.com") {
          // Store the password for future logins
          localStorage.setItem(`password_${user.id}`, formData.password);
        }
        
        // User is authenticated, check if they need profile setup
        if (!user.tagline || !user.username) {
          setShowProfileSetup(true);
        } else {
          router.push("/dashboard");
          if (onSuccess) onSuccess();
        }
      } else {
        setErrors({ submit: "Invalid email or password. Try demo@example.com with any password." });
      }
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