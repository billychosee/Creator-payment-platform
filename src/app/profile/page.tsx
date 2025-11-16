"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { ProfileForm } from "@/components/forms/ProfileForm";
import { Button } from "@/components/ui/Button";
import { MOCK_USER } from "@/services/mock";
import { Share2, Edit2 } from "lucide-react";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in max-w-3xl">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground mt-2">
            View and manage your creator profile
          </p>
        </div>

        {!isEditing ? (
          <>
            {/* Profile Card */}
            <Card>
              <CardContent className="pt-8 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-6">
                    <img
                      src={MOCK_USER.profileImage}
                      alt="Profile"
                      className="w-20 h-20 rounded-full"
                    />
                    <div>
                      <h2 className="text-2xl font-bold">
                        {MOCK_USER.username}
                      </h2>
                      <p className="text-muted-foreground">
                        {MOCK_USER.tagline}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    className="gap-2"
                  >
                    <Edit2 size={16} />
                    Edit
                  </Button>
                </div>

                <div className="pt-6 border-t border-border">
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Bio
                  </p>
                  <p className="text-foreground">{MOCK_USER.bio}</p>
                </div>

                <div className="pt-4">
                  <p className="text-sm font-medium text-muted-foreground mb-3">
                    Social Links
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(MOCK_USER.socialLinks || {}).map(
                      ([key, value]) =>
                        value && (
                          <a
                            key={key}
                            href={`https://${key}.com/${value}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm hover:bg-primary/20 transition"
                          >
                            {value}
                          </a>
                        )
                    )}
                  </div>
                </div>

                <Button className="w-full gap-2" variant="secondary">
                  <Share2 size={16} />
                  Share Profile
                </Button>
              </CardContent>
            </Card>

            {/* Creator ID Card */}
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Creator ID
                </p>
                <p className="font-mono text-sm bg-secondary/50 p-3 rounded-lg break-all">
                  {MOCK_USER.id}
                </p>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
            <ProfileForm />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
