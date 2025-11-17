"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { LocalDatabase } from "@/services/localDatabase";
import { User } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

export const ProfileForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    tagline: "",
    bio: "",
    socialLink: "",
  });

  // Load current user data
  useEffect(() => {
    const user = LocalDatabase.getCurrentUser();
    if (user) {
      setCurrentUser(user);
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
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!currentUser) return;
    
    setIsLoading(true);
    try {
      // Update user profile in local database
      LocalDatabase.updateUser(currentUser.id, {
        username: formData.username,
        tagline: formData.tagline,
        bio: formData.bio,
        socialLinks: {
          primary: formData.socialLink || undefined,
        }
      });

      // Refresh current user data
      const updatedUser = LocalDatabase.getCurrentUser();
      if (updatedUser) {
        setCurrentUser(updatedUser);
      }
      
      alert("Profile updated successfully!");
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
            <img
              src={currentUser?.profileImage || "/placeholder-avatar.png"}
              alt="Profile"
              className="w-16 h-16 rounded-full"
              onError={(e) => {
                // Fallback to a placeholder if image fails to load
                (e.target as HTMLImageElement).src = "/placeholder-avatar.png";
              }}
            />
            <Button variant="outline">Upload New Photo</Button>
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
