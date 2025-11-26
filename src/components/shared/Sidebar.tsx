"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Send,
  FileText,
  Settings,
  User,
  Menu,
  X,
  CreditCard,
  LogOut,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { gradients } from "@/lib/colors";

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: CreditCard, label: "Payments", href: "/payments/payment-link" },
    { icon: FileText, label: "Transactions", href: "/payments/transactions" },
    { icon: Send, label: "Payouts", href: "/payments/payouts" },
    { icon: Bell, label: "Notifications", href: "/notifications" },
    { icon: User, label: "Profile", href: "/profile" },
    { icon: Settings, label: "Settings", href: "/settings" },
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
        <Link href="/dashboard" className="flex items-center">
          <img src="/Tese-Logo.svg" alt="Tese" className="h-8" />
        </Link>

        {/* Navigation */}
        <nav className="space-y-2">
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
                  color: isActive(item.href) ? 'white' : undefined
                }}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
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
