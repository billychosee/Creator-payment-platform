"use client";

import { useState, useRef } from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
  User,
  CreditCard,
  Shield,
  FileText,
  Upload,
  X,
  Camera,
  Building,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<
    "profile" | "banking" | "security" | "documents"
  >("profile");

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [bankingData, setBankingData] = useState({
    accountHolder: "",
    bankName: "",
    accountNumber: "",
    branchCode: "",
    accountType: "savings",
  });

  const [profileData, setProfileData] = useState({
    username: "alex_creator",
    tagline: "Digital Creator",
    bio: "I create amazing content and love helping others.",
    socialLink: "https://alexcreator.com",
    email: "alex@example.com",
  });

  const [profileImage, setProfileImage] = useState("/placeholder-avatar.png");
  const [residenceDocument, setResidenceDocument] = useState<File | null>(null);
  const [documentPreview, setDocumentPreview] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "banking", label: "Banking Details", icon: CreditCard },
    { id: "security", label: "Security", icon: Shield },
    { id: "documents", label: "Verification", icon: FileText },
  ];

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBankingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setBankingData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setProfileImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];
    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a PDF, JPG, or PNG file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    setResidenceDocument(file);

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setDocumentPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setDocumentPreview(""); // No preview for PDFs
    }
  };

  const removeDocument = () => {
    setResidenceDocument(null);
    setDocumentPreview("");
  };

  const handleSaveProfile = () => {
    // Save profile logic here
    alert("Profile updated successfully!");
  };

  const handleSaveBanking = () => {
    // Save banking details logic here
    alert("Banking details updated successfully!");
  };

  const handleUpdatePassword = () => {
    if (passwords.new !== passwords.confirm) {
      alert("New passwords do not match");
      return;
    }
    if (passwords.new.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }
    // Update password logic here
    alert("Password updated successfully!");
    setPasswords({ current: "", new: "", confirm: "" });
  };

  const handleUploadDocument = () => {
    if (!residenceDocument) {
      alert("Please select a document to upload");
      return;
    }
    // Upload document logic here
    alert("Document uploaded successfully for verification!");
    removeDocument();
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account, banking details, and verification documents
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
            {activeTab === "profile" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User size={20} />
                      Profile Information
                    </CardTitle>
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
                              (e.target as HTMLImageElement).src =
                                "/placeholder-avatar.png";
                            }}
                          />
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors"
                            type="button"
                          >
                            <Camera size={14} />
                          </button>
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
                            className="gap-2"
                          >
                            <Upload size={16} />
                            Upload New Photo
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
                      value={profileData.username}
                      onChange={handleProfileChange}
                    />

                    <Input
                      label="Email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      type="email"
                    />

                    <Input
                      label="Tagline"
                      name="tagline"
                      value={profileData.tagline}
                      onChange={handleProfileChange}
                      placeholder="What do you do?"
                    />

                    <Textarea
                      label="Bio"
                      name="bio"
                      value={profileData.bio}
                      onChange={handleProfileChange}
                      placeholder="Tell your audience about yourself..."
                      rows={4}
                    />

                    <Input
                      label="Social Link"
                      name="socialLink"
                      value={profileData.socialLink}
                      onChange={handleProfileChange}
                      placeholder="https://your-profile.com or @username"
                    />

                    <Button onClick={handleSaveProfile} className="w-full">
                      Save Profile Changes
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-destructive">
                      Danger Zone
                    </CardTitle>
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

            {activeTab === "banking" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard size={20} />
                    Banking Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-sm text-muted-foreground">
                    Add your banking details for receiving payouts and payments.
                  </p>

                  <Input
                    label="Account Holder Name"
                    name="accountHolder"
                    value={bankingData.accountHolder}
                    onChange={handleBankingChange}
                    placeholder="John Doe"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Bank Name
                      </label>
                      <select
                        name="bankName"
                        value={bankingData.bankName}
                        onChange={handleBankingChange}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select Bank</option>
                        <option value="absa">ABSA</option>
                        <option value="fnb">First National Bank</option>
                        <option value="standard-bank">Standard Bank</option>
                        <option value="nedbank">Nedbank</option>
                        <option value="capitec">Capitec Bank</option>
                        <option value="discovery-bank">Discovery Bank</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Account Type
                      </label>
                      <select
                        name="accountType"
                        value={bankingData.accountType}
                        onChange={handleBankingChange}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="savings">Savings</option>
                        <option value="cheque">Cheque/Current</option>
                        <option value="credit">Credit</option>
                      </select>
                    </div>
                  </div>

                  <Input
                    label="Account Number"
                    name="accountNumber"
                    value={bankingData.accountNumber}
                    onChange={handleBankingChange}
                    placeholder="1234567890"
                    maxLength={11}
                  />

                  <Input
                    label="Branch Code"
                    name="branchCode"
                    value={bankingData.branchCode}
                    onChange={handleBankingChange}
                    placeholder="632005"
                    maxLength={6}
                  />

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <Building
                        className="text-blue-600 dark:text-blue-400 mt-0.5"
                        size={16}
                      />
                      <div className="text-sm">
                        <p className="font-medium text-blue-900 dark:text-blue-100">
                          Security Note
                        </p>
                        <p className="text-blue-700 dark:text-blue-300 mt-1">
                          Your banking details are encrypted and stored
                          securely. We never store your full account numbers.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleSaveBanking} className="w-full">
                    Save Banking Details
                  </Button>
                </CardContent>
              </Card>
            )}

            {activeTab === "security" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield size={20} />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-4">Change Password</h4>
                    <div className="space-y-4">
                      <div className="relative">
                        <Input
                          label="Current Password"
                          name="current"
                          type={showPasswords.current ? "text" : "password"}
                          value={passwords.current}
                          onChange={handlePasswordChange}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("current")}
                          className="absolute right-3 top-8 text-muted-foreground hover:text-foreground"
                        >
                          {showPasswords.current ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>

                      <div className="relative">
                        <Input
                          label="New Password"
                          name="new"
                          type={showPasswords.new ? "text" : "password"}
                          value={passwords.new}
                          onChange={handlePasswordChange}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("new")}
                          className="absolute right-3 top-8 text-muted-foreground hover:text-foreground"
                        >
                          {showPasswords.new ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>

                      <div className="relative">
                        <Input
                          label="Confirm New Password"
                          name="confirm"
                          type={showPasswords.confirm ? "text" : "password"}
                          value={passwords.confirm}
                          onChange={handlePasswordChange}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("confirm")}
                          className="absolute right-3 top-8 text-muted-foreground hover:text-foreground"
                        >
                          {showPasswords.confirm ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>

                      <Button
                        onClick={handleUpdatePassword}
                        className="w-full"
                        disabled={
                          !passwords.current ||
                          !passwords.new ||
                          !passwords.confirm
                        }
                      >
                        <Lock size={16} className="mr-2" />
                        Update Password
                      </Button>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border">
                    <h4 className="font-semibold mb-4">
                      Two-Factor Authentication
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add an extra layer of security to your account
                    </p>
                    <Button variant="outline" className="w-full">
                      Enable 2FA
                    </Button>
                  </div>

                  <div className="pt-6 border-t border-border">
                    <h4 className="font-semibold mb-4">Active Sessions</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Manage your active login sessions
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div>
                          <p className="font-medium">Current Session</p>
                          <p className="text-sm text-muted-foreground">
                            Chrome on Windows • Johannesburg, SA
                          </p>
                        </div>
                        <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "documents" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText size={20} />
                    Verification Documents
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <FileText
                        className="text-yellow-600 dark:text-yellow-400 mt-0.5"
                        size={16}
                      />
                      <div className="text-sm">
                        <p className="font-medium text-yellow-900 dark:text-yellow-100">
                          Verification Required
                        </p>
                        <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                          Upload a proof of residence document to complete your
                          account verification and enable all features.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Proof of Residence
                    </label>

                    {residenceDocument ? (
                      <div className="space-y-4">
                        <div className="border border-border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FileText
                                size={20}
                                className="text-muted-foreground"
                              />
                              <div>
                                <p className="font-medium">
                                  {residenceDocument.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {(
                                    residenceDocument.size /
                                    1024 /
                                    1024
                                  ).toFixed(2)}{" "}
                                  MB
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={removeDocument}
                            >
                              <X size={16} />
                            </Button>
                          </div>

                          {documentPreview && (
                            <div className="mt-4">
                              <img
                                src={documentPreview}
                                alt="Document preview"
                                className="max-w-full h-auto rounded border border-border"
                              />
                            </div>
                          )}
                        </div>

                        <Button
                          onClick={handleUploadDocument}
                          className="w-full"
                        >
                          <Upload size={16} className="mr-2" />
                          Upload for Verification
                        </Button>
                      </div>
                    ) : (
                      <div
                        onClick={() => documentInputRef.current?.click()}
                        className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-secondary/30 transition-colors"
                      >
                        <Upload
                          size={32}
                          className="mx-auto text-muted-foreground mb-4"
                        />
                        <p className="font-medium mb-2">
                          Upload Proof of Residence
                        </p>
                        <p className="text-sm text-muted-foreground mb-4">
                          Drag and drop your document here, or click to browse
                        </p>
                        <Button variant="outline" type="button">
                          Choose File
                        </Button>
                      </div>
                    )}

                    <input
                      ref={documentInputRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleDocumentUpload}
                      className="hidden"
                    />

                    <div className="mt-4 space-y-2">
                      <p className="text-xs text-muted-foreground">
                        <strong>Accepted formats:</strong> PDF, JPG, PNG
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <strong>File size:</strong> Maximum 10MB
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <strong>Accepted documents:</strong> Utility bill, bank
                        statement, lease agreement, or official correspondence
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border">
                    <h4 className="font-semibold mb-4">Verification Status</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="font-medium">
                            Proof of Residence
                          </span>
                        </div>
                        <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full">
                          Pending
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="font-medium">
                            Email Verification
                          </span>
                        </div>
                        <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                          Verified
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
