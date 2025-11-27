"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { CheckCircle, Mail } from "lucide-react";

interface RegistrationFormProps {
  onSuccess?: () => void;
}

export const RegistrationForm = ({ onSuccess }: RegistrationFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    socialLink: "",
    acceptTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const titleOptions = [
    { value: "mr", label: "Mr" },
    { value: "mrs", label: "Mrs" },
    { value: "miss", label: "Miss" },
    { value: "dr", label: "Dr" },
    { value: "rev", label: "Rev" },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Confirm password is required";
    
    // Social media link is optional, no validation required
    // Optional: add validation if you want to validate the format of the social link
    if (formData.socialLink.trim() && !formData.socialLink.includes('.') && !formData.socialLink.startsWith('@')) {
      newErrors.socialLink = "Please provide a valid social media link or username";
    }
    
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "You must accept the terms and conditions";
    }

    // Basic email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password strength validation
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateOTP = (): string => {
    // Generate 6-digit OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendVerificationEmail = async (email: string, otp: string) => {
    // Placeholder for email service - replace with actual email API
    console.log("Sending verification OTP email to:", email);
    console.log("OTP Code:", otp);
    console.log("User social media data:", {
      socialLink: formData.socialLink,
    });
    
    // In a real application, you would use an email service like:
    // - SendGrid
    // - Mailgun
    // - AWS SES
    // - Resend
    // etc.
    
    // For demo purposes, we'll just simulate the API call
    try {
      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate OTP verification URL
      const otpVerificationUrl = `${window.location.origin}/verify-otp?email=${encodeURIComponent(email)}`;
      console.log("OTP Verification URL:", otpVerificationUrl);
      
      // In production, this would be sent via email service with OTP code
      alert(`Verification email would be sent to ${email}\n\nFor demo purposes, you can copy this OTP:\n\n${otp}\n\nOr visit: ${otpVerificationUrl}`);
      
    } catch (error) {
      console.error("Failed to send verification email:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

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

      // Generate OTP code
      const otpCode = generateOTP();
      
      // Create user using API service with consistent format
      const newUser = await APIService.createUser({
        username: `${formData.firstName.toLowerCase()}_${formData.lastName.toLowerCase()}_${Date.now()}`,
        email: formData.email,
        password: formData.password,
        tagline: `${formData.title} ${formData.firstName} ${formData.lastName}`,
        bio: `Social Media: ${formData.socialLink || 'Not provided'}`,
        socialLinks: {
          primary: formData.socialLink || undefined,
        }
      });
      
      // Send OTP verification email
      setVerificationEmail(formData.email);
      await sendVerificationEmail(formData.email, otpCode);
      
      setIsRegistered(true);
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Registration failed:", error);
      setErrors({ submit: "Registration failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginClick = () => {
    router.push("/login");
  };

  const handleResendOTP = async () => {
    try {
      // Import API service
      const APIService = await import("@/services/api");
      
      // Get current user
      const currentUser = await APIService.getCurrentUser();
      if (currentUser && currentUser.email) {
        const newOTP = generateOTP();
        await sendVerificationEmail(currentUser.email, newOTP);
      }
    } catch (error) {
      console.error("Failed to resend OTP:", error);
    }
  };

  // Show verification message after successful registration
  if (isRegistered) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-yellow-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle>Check Your Email</CardTitle>
            <CardDescription>
              We've sent a verification code to <strong>{verificationEmail}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <p className="text-sm text-muted-foreground">
              Enter the 6-digit verification code from your email to activate your account.
              If you don't see the email, check your spam folder.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 font-medium">
                <strong>Next Step:</strong> Copy the 6-digit code from your email and enter it on the OTP verification page.
              </p>
            </div>
            
            <div className="space-y-3">
              <Button
                onClick={() => router.push("/verify-otp")}
                className="w-full"
              >
                Enter Verification Code
              </Button>
              
              <Button
                variant="outline"
                onClick={handleResendOTP}
                className="w-full"
              >
                <Mail className="w-4 h-4 mr-2" />
                Resend OTP Code
              </Button>
              
              <p
                onClick={handleLoginClick}
                className="text-sm text-muted-foreground hover:underline cursor-pointer"
              >
                Already have an account? <span className="hover:text-red-500">Login</span>
              </p>
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-yellow-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <img src="/Tese-Icon.png" alt="Tese Icon" className="mx-auto mb-4 w-16 h-16" />
          <CardTitle>Create Account</CardTitle>
          <CardDescription>Join Tese today</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              options={titleOptions}
              error={errors.title}
              required
            />

            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
              error={errors.firstName}
              required
            />

            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter your last name"
              error={errors.lastName}
              required
            />

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

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              error={errors.confirmPassword}
              required
            />

            {/* Social Media Links Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-foreground">Social Media Presence (Optional)</h3>
              
              <Input
                label="Primary Social Link"
                name="socialLink"
                value={formData.socialLink}
                onChange={handleChange}
                placeholder="https://your-social-profile.com or @username"
                error={errors.socialLink}
              />
            </div>

            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                name="acceptTerms"
                id="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                required
              />
              <label htmlFor="acceptTerms" className="text-sm text-foreground">
                I accept the{" "}
                <a href="#" className="text-primary hover:underline">
                  terms and conditions
                </a>
              </label>
            </div>
            {errors.acceptTerms && (
              <p className="text-xs text-destructive">{errors.acceptTerms}</p>
            )}

            {errors.submit && (
              <p className="text-sm text-destructive">{errors.submit}</p>
            )}

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full"
            >
              Register
            </Button>
          </form>

          <div className="text-center">
            <p
              onClick={handleLoginClick}
              className="text-sm text-muted-foreground hover:underline hover:text-red-500 cursor-pointer"
            >
              Already registered? Login
            </p>
          </div>

          <div className="text-center text-xs text-muted-foreground pt-4 border-t">
            <p>© 2025 Tese. All rights reserved.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};