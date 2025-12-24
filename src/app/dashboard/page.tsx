"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { Dashboard } from "@/components/ui/Dashboard";
import { APIService } from "@/services/api";

export default function DashboardPage() {
  const router = useRouter();
  const [period, setPeriod] = useState<
    "daily" | "weekly" | "monthly" | "yearly"
  >("daily");
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalBalance: 0,
    totalPaidOut: 0,
    views: 0,
    watchTime: "00:00:00",
    subscribers: 0,
    subscriptionEarningsPerMonth: 0,
    payPerView: 0,
    topViewedVideos: [],
    totalEarnings: 0,
    todayEarnings: 0,
    pendingPayouts: 0,
    totalTransactions: 0,
  });

  // Load user data and stats
  useEffect(() => {
    const loadData = async () => {
      try {
        // Try to get current user
        const user = await APIService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
          // Try to get dashboard stats
          try {
            const userStats = await APIService.getDashboardStats(user.id);
            setStats(userStats);
          } catch (statsError) {
            console.warn(
              "Failed to load dashboard stats, using defaults:",
              statsError
            );
            // Use default stats if API fails
            setStats({
              totalBalance: 0,
              totalPaidOut: 0,
              views: 0,
              watchTime: "00:00:00",
              subscribers: 0,
              subscriptionEarningsPerMonth: 0,
              payPerView: 0,
              topViewedVideos: [],
              totalEarnings: 0,
              todayEarnings: 0,
              pendingPayouts: 0,
              totalTransactions: 0,
            });
          }
        } else {
          console.log("No current user found");
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        // Don't throw error, just log it and continue with default stats
      }
    };

    loadData();
  }, []);

  const chartData = generateMockChartData(period);

  function generateMockChartData(period: string) {
    const data = [];
    const now = new Date();
    const days =
      period === "daily"
        ? 7
        : period === "weekly"
        ? 4
        : period === "monthly"
        ? 12
        : 5;

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      if (period === "daily") {
        date.setDate(date.getDate() - i);
      } else if (period === "weekly") {
        date.setDate(date.getDate() - i * 7);
      } else if (period === "monthly") {
        date.setMonth(date.getMonth() - i);
      } else {
        date.setFullYear(date.getFullYear() - i);
      }

      data.push({
        name:
          period === "daily"
            ? date.toLocaleDateString("en-US", { weekday: "short" })
            : period === "weekly"
            ? `Week ${days - i}`
            : period === "monthly"
            ? date.toLocaleDateString("en-US", { month: "short" })
            : date.getFullYear().toString(),
        earnings: Math.floor(Math.random() * 500) + 100,
        transactions: Math.floor(Math.random() * 20) + 5,
      });
    }

    return data;
  }

  const handlePeriodChange = async (
    newPeriod: "daily" | "weekly" | "monthly" | "yearly"
  ) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setPeriod(newPeriod);
    setIsLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <Dashboard
          metrics={stats}
          onWithdraw={() => router.push("/payments/payouts")}
          period={period}
          onPeriodChange={handlePeriodChange}
          isLoading={isLoading}
        />
      </div>
    </DashboardLayout>
  );
}
