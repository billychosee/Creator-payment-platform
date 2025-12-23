"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/app/layout/ThemeProvider";
import {
  LayoutDashboard,
  Users,
  FileText,
  Wallet,
  Settings,
  Play,
  List,
  AlertTriangle,
  LogOut,
  Sun,
  Moon,
  X,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { gradients } from "@/lib/colors";

export const Sidebar = () => {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    { id: "channels", label: "Channels", icon: Users, href: "/channels" },
    { id: "playlists", label: "Playlists", icon: List, href: "/playlists" },
    { id: "videos", label: "Videos", icon: Play, href: "/videos" },
    { id: "payments", label: "Payments", icon: Wallet, href: "/payments" },
    { id: "reports", label: "Reports", icon: AlertTriangle, href: "/reports" },
    { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="fixed top-4 left-4 z-40 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-64 bg-card border-r border-border p-6 space-y-8",
          "transition-transform duration-300 z-40",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div
          className="flex items-center cursor-pointer"
          onClick={() => router.push("/dashboard")}
        >
          <img
            src={
              theme === "light" ? "/Tese-Dark-logo.png" : "/Tese-Light-Logo.png"
            }
            alt="Tese"
            className="h-16"
          />
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          <div className="space-y-1">
            <h3 className="px-4 py-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Main
            </h3>
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                    isActive(item.href)
                      ? `bg-gradient-to-r ${gradients.primary} text-white shadow-lg hover:shadow-xl hover:brightness-110 active-menu-item`
                      : "text-foreground hover:bg-secondary/50"
                  )}
                  style={{
                    color: isActive(item.href) ? "white" : undefined,
                  }}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Logout */}
        <div className="absolute bottom-6 left-6 right-6">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-all duration-200">
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
