"use client";

import { useState } from "react";
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

export const ProfileForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "alex_creator",
    tagline: "Digital creator | Content filmmaker",
    bio: "Creating amazing content for amazing people",
    twitter: "@alex_creator",
    instagram: "@alexcreator",
    tiktok: "@alexcreator",
    youtube: "AlexCreatorChannel",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
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
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=alex"
              alt="Profile"
              className="w-16 h-16 rounded-full"
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
            label="Twitter"
            name="twitter"
            value={formData.twitter}
            onChange={handleChange}
            placeholder="@yourhandle"
          />
          <Input
            label="Instagram"
            name="instagram"
            value={formData.instagram}
            onChange={handleChange}
            placeholder="@yourhandle"
          />
          <Input
            label="TikTok"
            name="tiktok"
            value={formData.tiktok}
            onChange={handleChange}
            placeholder="@yourhandle"
          />
          <Input
            label="YouTube"
            name="youtube"
            value={formData.youtube}
            onChange={handleChange}
            placeholder="Your channel name"
          />
        </div>

        <Button onClick={handleSubmit} isLoading={isLoading} className="w-full">
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
};
