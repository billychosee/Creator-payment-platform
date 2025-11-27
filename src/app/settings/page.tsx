"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Key, Lock, Bell, Globe } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<
    "general" | "notifications" | "security" | "api" | "social"
  >("general");

  const tabs = [
    { id: "general", label: "General", icon: Globe },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Lock },
    { id: "api", label: "API Keys", icon: Key },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account and preferences
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Tabs */}
          <div className="flex lg:flex-col gap-2 border-b lg:border-b-0 lg:border-r border-border pb-4 lg:pb-0 lg:pr-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-secondary/50"
                  }`}
                >
                  <Icon size={18} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="flex-1 max-w-2xl">
            {activeTab === "general" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input label="Email" value="alex@example.com" readOnly />
                    <Input label="Username" value="alex_creator" readOnly />
                    <div className="pt-4">
                      <Button variant="outline">Change Email</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Danger Zone</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all associated data.
                    </p>
                    <Button variant="destructive">Delete Account</Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "notifications" && (
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      label: "Payment Received",
                      description: "Get notified when you receive a payment",
                    },
                    {
                      label: "Payout Completed",
                      description: "Get notified when your payout is completed",
                    },
                    {
                      label: "New Payment Request",
                      description: "Get notified of new payment requests",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-3 border-b border-border last:border-0"
                    >
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4"
                      />
                    </div>
                  ))}
                  <Button className="w-full mt-4">Save Preferences</Button>
                </CardContent>
              </Card>
            )}

            {activeTab === "security" && (
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3">Change Password</h4>
                    <Input
                      label="Current Password"
                      type="password"
                      className="mb-3"
                    />
                    <Input
                      label="New Password"
                      type="password"
                      className="mb-3"
                    />
                    <Input
                      label="Confirm Password"
                      type="password"
                      className="mb-3"
                    />
                    <Button className="w-full">Update Password</Button>
                  </div>

                  <div className="pt-6 border-t border-border">
                    <h4 className="font-semibold mb-3">
                      Two-Factor Authentication
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add an extra layer of security to your account
                    </p>
                    <Button variant="outline" className="w-full">
                      Enable 2FA
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "api" && (
              <Card>
                <CardHeader>
                  <CardTitle>API Keys</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Create and manage API keys for integrations
                  </p>

                  <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
                    <p className="text-xs font-mono text-muted-foreground">
                      API_KEY_abc123xyz789
                    </p>
                    <Button size="sm" variant="outline">
                      Copy
                    </Button>
                  </div>

                  <Button className="w-full">Generate New Key</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

