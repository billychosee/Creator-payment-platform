"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { ProfileForm } from "@/components/forms/ProfileForm";
import { Button } from "@/components/ui/Button";
import APIService from "@/services/api";
import { User } from "@/types";
import { ExternalLink } from "lucide-react";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profileRefreshKey, setProfileRefreshKey] = useState(0);

  // Load current user data
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const user = await APIService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
        }
      } catch (error) {
        console.error("Failed to load current user:", error);
      }
    };

    loadCurrentUser();
  }, [profileRefreshKey]);

  const handleEditSuccess = () => {
    setIsEditing(false);
    setProfileRefreshKey(prev => prev + 1);
  };

  const handleShareProfile = () => {
    if (currentUser) {
      const shareUrl = `${window.location.origin}/creator/${currentUser.username}`;
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert("Profile link copied to clipboard!");
      }).catch(() => {
        alert(`Profile URL: ${shareUrl}`);
      });
    }
  };

  if (!currentUser) {
    return (
      <DashboardLayout>
        <div className="space-y-8 animate-fade-in max-w-3xl">
          <div>
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-muted-foreground mt-2">
              Loading your profile...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-muted-foreground mt-2">
              View and manage your creator profile
            </p>
          </div>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="px-6"
            >
              Edit Profile
            </Button>
          )}
        </div>

        {!isEditing ? (
          <>
            {/* Profile Card */}
            <Card>
              <CardContent className="pt-8 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-6">
                    <img
                      src={currentUser.profileImage || "/placeholder-avatar.png"}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-2 border-border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder-avatar.png";
                      }}
                    />
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-1">
                        {currentUser.username}
                      </h2>
                      {currentUser.tagline && (
                        <p className="text-muted-foreground text-lg">
                          {currentUser.tagline}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {currentUser.bio && (
                  <div className="pt-6 border-t border-border">
                    <p className="text-sm font-medium text-muted-foreground mb-3">
                      About
                    </p>
                    <p className="text-foreground leading-relaxed">{currentUser.bio}</p>
                  </div>
                )}

                {currentUser.socialLinks && Object.keys(currentUser.socialLinks).length > 0 && (
                  <div className="pt-6 border-t border-border">
                    <p className="text-sm font-medium text-muted-foreground mb-4">
                      Social Links
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.entries(currentUser.socialLinks).map(
                        ([platform, handle]) => {
                          if (!handle) return null;
                          
                          let url = "";
                          let displayHandle = handle;
                          
                          if (handle.startsWith("http")) {
                            url = handle;
                          } else {
                            // Generate appropriate URLs for different platforms
                            switch (platform.toLowerCase()) {
                              case "twitter":
                                url = `https://twitter.com/${handle.replace("@", "")}`;
                                break;
                              case "instagram":
                                url = `https://instagram.com/${handle.replace("@", "")}`;
                                break;
                              case "tiktok":
                                url = `https://tiktok.com/${handle.replace("@", "")}`;
                                break;
                              case "youtube":
                                url = `https://youtube.com/${handle}`;
                                break;
                              case "twitch":
                                url = `https://twitch.tv/${handle}`;
                                break;
                              case "linkedin":
                                url = `https://linkedin.com/in/${handle}`;
                                break;
                              default:
                                url = handle;
                            }
                          }
                          
                          return (
                            <a
                              key={platform}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors group"
                            >
                              <span className="font-medium capitalize">{platform}</span>
                              <span className="text-muted-foreground group-hover:text-foreground">
                                {displayHandle}
                              </span>
                              <ExternalLink size={14} className="ml-auto text-muted-foreground group-hover:text-foreground" />
                            </a>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}

                <div className="pt-6 border-t border-border">
                  <Button
                    onClick={handleShareProfile}
                    className="w-full"
                    variant="secondary"
                  >
                    Share Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Creator ID Card */}
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm font-medium text-muted-foreground mb-3">
                  Creator ID
                </p>
                <div className="bg-secondary/30 p-4 rounded-lg">
                  <p className="font-mono text-sm break-all">{currentUser.id}</p>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Edit Profile</h2>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
            <ProfileForm onSuccess={handleEditSuccess} />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

