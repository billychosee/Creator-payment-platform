"use client";

import { useTheme } from "@/app/layout/ThemeProvider";
import { Bell, Moon, Sun, Settings } from "lucide-react";
import Link from "next/link";
import { MOCK_USER } from "@/services/mock";

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

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

          {/* Profile */}
          <Link
            href="/profile"
            className="flex items-center gap-3 p-2 hover:bg-secondary/50 rounded-lg transition-colors"
          >
            <img
              src={MOCK_USER.profileImage}
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium">{MOCK_USER.username}</p>
              <p className="text-xs text-muted-foreground">{MOCK_USER.email}</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
