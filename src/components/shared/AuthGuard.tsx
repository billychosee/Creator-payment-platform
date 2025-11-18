"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LocalDatabase } from "@/services/localDatabase";
import { User } from "@/types";

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const AuthGuard = ({ children, redirectTo = "/login" }: AuthGuardProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    const user = LocalDatabase.getCurrentUser();
    
    if (!user) {
      // Redirect to login if not authenticated
      router.push(redirectTo);
      return;
    }

    setCurrentUser(user);
    setIsLoading(false);
  }, [router, redirectTo]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Render children only if user is authenticated
  return currentUser ? <>{children}</> : null;
};

export default AuthGuard;