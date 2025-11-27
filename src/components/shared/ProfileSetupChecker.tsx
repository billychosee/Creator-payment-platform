"use client";

import { useEffect, useState } from "react";
import { ProfileSetupModal } from "@/components/ui/ProfileSetupModal";
import { useRouter } from "next/navigation";

export const ProfileSetupChecker = () => {
  const [showModal, setShowModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in and profile is incomplete
    const checkProfileStatus = () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      
      if (!isLoggedIn) {
        return; // User not logged in, don't show modal
      }

      const userData = localStorage.getItem("user");
      if (!userData) {
        return; // No user data, don't show modal
      }

      try {
        const parsedUser = JSON.parse(userData);
        setUserEmail(parsedUser.email || "");
        
        // Check if profile setup is incomplete
        if (!parsedUser.hasCompletedProfileSetup) {
          setShowModal(true);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    };

    // Check on mount
    checkProfileStatus();

    // Also check when localStorage changes
    const handleStorageChange = () => {
      checkProfileStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically in case localStorage changes without storage event
    const interval = setInterval(checkProfileStatus, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleProfileSetupComplete = (profileData: any) => {
    // Update user data with completion status
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        parsedUser.profileData = profileData;
        parsedUser.profileCompletedAt = new Date().toISOString();
        parsedUser.hasCompletedProfileSetup = true;
        localStorage.setItem("user", JSON.stringify(parsedUser));
      } catch (error) {
        console.error("Error updating user data:", error);
      }
    }
    
    setShowModal(false);
    // Force a page reload to update the UI
    window.location.reload();
  };

  const handleClose = () => {
    // Don't allow closing without completion
    // User must complete profile to proceed
    setShowModal(true);
  };

  // Only show modal if profile is incomplete
  if (!showModal) {
    return null;
  }

  return (
    <>
      {/* Block all page interactions */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 pointer-events-auto" />
      
      {/* Profile Setup Modal */}
      <ProfileSetupModal
        isOpen={showModal}
        userEmail={userEmail}
        onClose={handleClose}
        onComplete={handleProfileSetupComplete}
      />
    </>
  );
};
