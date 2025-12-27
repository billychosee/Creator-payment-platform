"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

interface SignupFormProps {
  onSkip?: () => void;
}

export const SignupForm = ({ onSkip }: SignupFormProps) => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    tagline: "",
    socialLink: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateStep = (stepNum: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepNum === 1) {
      if (!formData.username.trim())
        newErrors.username = "Username is required";
      if (!formData.tagline.trim()) newErrors.tagline = "Tagline is required";
    } else if (stepNum === 2) {
      // Social links are optional
    } else if (stepNum === 3) {
      if (!formData.email.trim()) newErrors.email = "Email is required";
      if (!formData.password) newErrors.password = "Password is required";
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Import API service
      const APIService = await import("@/services/api");
      
      // Check if user already exists
      const existingUser = await APIService.getUserByEmail(formData.email);
      if (existingUser) {
        setErrors({ email: "An account with this email already exists" });
        setIsLoading(false);
        return;
      }

      const existingUsername = await APIService.getUserByUsername(formData.username);
      if (existingUsername) {
        setErrors({ username: "This username is already taken" });
        setIsLoading(false);
        return;
      }

      // Create user using API
      const newUser = await APIService.createUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        tagline: formData.tagline,
        socialLinks: {
          primary: formData.socialLink || undefined
        }
      });

      // Set current user
      await APIService.setCurrentUser(newUser.id);
      
      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Signup failed:", error);
      setErrors({ submit: "Failed to create account. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Your Creator Account</CardTitle>
          <CardDescription>
            Step {step} of 3 - Let's set up your profile
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4">
              <Input
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Your unique username"
                error={errors.username}
              />
              <Textarea
                label="Tagline"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                placeholder="What do you do? e.g., 'Digital creator | Content filmmaker'"
                error={errors.tagline}
                rows={3}
              />
            </div>
          )}

          {/* Step 2: Social Links */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Connect your social accounts (optional)
              </p>
              <Input
                label="Social Media (Optional)"
                name="socialLink"
                value={formData.socialLink}
                onChange={handleChange}
                placeholder="https://your-profile.com or @username"
              />
            </div>
          )}

          {/* Step 3: Account */}
          {step === 3 && (
            <div className="space-y-4">
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                error={errors.email}
              />
              <Input
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Secure password"
                error={errors.password}
              />
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                error={errors.confirmPassword}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {step > 1 && (
              <Button
                variant="gradient"
                onClick={handlePrevious}
                className="flex-1"
              >
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button onClick={handleNext} className="flex-1">
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                isLoading={isLoading}
                className="flex-1"
              >
                Create Account
              </Button>
            )}
          </div>

          {step === 1 && (
            <Button variant="gradient" onClick={onSkip} className="w-full">
              I'll do it later
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

