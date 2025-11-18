"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import APIService from "@/services/api";
import { User } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Upload, X } from "lucide-react";

interface ProfileFormProps {
  onSuccess?: () => void;
}

export const ProfileForm = ({ onSuccess }: ProfileFormProps) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    tagline: "",
    bio: "",
    socialLink: "",
  });
  const [profileImage, setProfileImage] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Load current user data
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const user = await APIService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
          setProfileImage(user.profileImage || "/placeholder-avatar.png");
          setFormData({
            username: user.username,
            tagline: user.tagline || "",
            bio: user.bio || "",
            socialLink: user.socialLinks?.primary || "",
          });
        } else {
          // Redirect to login if not authenticated
          router.push("/login");
        }
      } catch (error) {
        console.error("Failed to load current user:", error);
        router.push("/login");
      }
    };

    loadCurrentUser();
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    setIsUploadingImage(true);

    // Convert to base64 for storage
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setProfileImage(base64);
      setIsUploadingImage(false);
    };
    reader.onerror = () => {
      alert("Failed to read image file");
      setIsUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setProfileImage("/placeholder-avatar.png");
  };

  const handleSubmit = async () => {
    if (!currentUser) return;
    
    setIsLoading(true);
    try {
      // Update user profile using API
      const updatedUser = await APIService.updateUser(currentUser.id, {
        username: formData.username,
        tagline: formData.tagline,
        bio: formData.bio,
        profileImage: profileImage !== "/placeholder-avatar.png" ? profileImage : undefined,
        socialLinks: {
          primary: formData.socialLink || undefined,
        }
      });

      if (updatedUser) {
        setCurrentUser(updatedUser);
      }
      
      alert("Profile updated successfully!");
      
      // Call the onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>
          Update your creator profile information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Picture */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Profile Picture
          </label>
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={profileImage}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-border"
                onError={(e) => {
                  // Fallback to a placeholder if image fails to load
                  (e.target as HTMLImageElement).src = "/placeholder-avatar.png";
                }}
              />
              {profileImage !== "/placeholder-avatar.png" && (
                <button
                  onClick={removeImage}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  type="button"
                >
                  <X size={12} />
                </button>
              )}
            </div>
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingImage}
                className="gap-2"
              >
                <Upload size={16} />
                {isUploadingImage ? "Uploading..." : "Upload New Photo"}
              </Button>
              <p className="text-xs text-muted-foreground">
                JPG, PNG or GIF. Max size 5MB.
              </p>
            </div>
          </div>
        </div>

        <Input
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />

        <Input
          label="Tagline"
          name="tagline"
          value={formData.tagline}
          onChange={handleChange}
          placeholder="What do you do?"
        />

        <Textarea
          label="Bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Tell your audience about yourself..."
          rows={4}
        />

        <div className="space-y-4">
          <h4 className="font-semibold text-sm">Social Links</h4>
          <Input
            label="Primary Social Link"
            name="socialLink"
            value={formData.socialLink}
            onChange={handleChange}
            placeholder="https://your-profile.com or @username"
          />
        </div>

        <Button onClick={handleSubmit} isLoading={isLoading} className="w-full">
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
};
