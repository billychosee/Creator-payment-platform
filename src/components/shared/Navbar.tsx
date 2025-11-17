"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/app/layout/ThemeProvider";
import { Bell, Moon, Sun, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LocalDatabase } from "@/services/localDatabase";
import { User } from "@/types";

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);

  useEffect(() => {
    // Load current user from local database
    const user = LocalDatabase.getCurrentUser();
    setCurrentUser(user);
  }, []);

  const handleLogout = () => {
    LocalDatabase.logout();
    setCurrentUser(null);
    router.push("/login");
  };

  // Don't render navbar if user is not logged in
  if (!currentUser) {
    return null;
  }

  return (
    <div className="fixed top-0 right-0 left-0 lg:left-64 h-16 border-b border-border bg-card z-30">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Spacer for mobile */}
        <div className="hidden lg:block" />

        {/* Right Section */}
        <div className="flex items-center gap-6">
          {/* Notifications */}
          <Link href="/notifications" className="relative p-2 hover:bg-secondary/50 rounded-lg transition-colors">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full notification-dot" />
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-secondary/50 rounded-lg transition-colors"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {/* Profile with Logout */}
          <div className="relative">
            <button
              onClick={() => setShowLogoutMenu(!showLogoutMenu)}
              className="flex items-center gap-3 p-2 hover:bg-secondary/50 rounded-lg transition-colors"
            >
              <img
                src={currentUser.profileImage || "/placeholder-avatar.png"}
                alt="Profile"
                className="w-8 h-8 rounded-full bg-muted"
                onError={(e) => {
                  // Fallback to a placeholder if image fails to load
                  (e.target as HTMLImageElement).src = "/placeholder-avatar.png";
                }}
              />
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium">{currentUser.username}</p>
                <p className="text-xs text-muted-foreground">{currentUser.email}</p>
              </div>
            </button>

            {/* Logout Menu */}
            {showLogoutMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-lg py-2 z-50">
                <Link
                  href="/profile"
                  className="flex items-center px-4 py-2 text-sm hover:bg-secondary/50 transition-colors"
                  onClick={() => setShowLogoutMenu(false)}
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Profile Settings
                </Link>
                <button
                  onClick={() => {
                    setShowLogoutMenu(false);
                    handleLogout();
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm hover:bg-secondary/50 transition-colors text-destructive"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
