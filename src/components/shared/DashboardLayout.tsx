"use client";

import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { ProfileSetupChecker } from "./ProfileSetupChecker";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <Navbar />
        <main className="mt-16 p-4 lg:p-8">{children}</main>
        <ProfileSetupChecker />
      </div>
    </div>
  );
};
