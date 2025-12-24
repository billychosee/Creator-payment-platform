"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Eye,
  Clock,
  Users,
  Wallet,
  Play,
  ArrowUpRight,
  ArrowLeft,
  Calendar,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";
// small animation fallback: use CSS transition instead of motion library
import { useTheme } from "@/app/layout/ThemeProvider";
import { ImageWithFallback } from "./ImageWithFallback";
import { DashboardStats } from "@/types";

interface DashboardProps {
  metrics: DashboardStats;
  onWithdraw: () => void;
  period?: "daily" | "weekly" | "monthly" | "yearly";
  onPeriodChange?: (period: "daily" | "weekly" | "monthly" | "yearly") => void;
  isLoading?: boolean;
}

export function Dashboard({
  metrics,
  onWithdraw,
  period,
  onPeriodChange,
  isLoading,
}: DashboardProps) {
  const { theme } = useTheme();
  const router = useRouter();

  // simple last-week comparison (mock if not provided)
  const lastWeekViews = Math.max(1, Math.round((metrics.views ?? 0) * 0.85));
  const viewsDiff = (metrics.views ?? 0) - lastWeekViews;
  const viewsDiffPct = lastWeekViews
    ? ((viewsDiff / lastWeekViews) * 100).toFixed(1)
    : "0.0";

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const [animateProgress, setAnimateProgress] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null);

  useEffect(() => {
    // trigger progress bar animation on mount
    setAnimateProgress(true);
  }, []);

  // Video thumbnail images
  const videoThumbnails = [
    "https://images.unsplash.com/photo-1654288891700-95f67982cbcc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "https://images.unsplash.com/photo-1636226570637-3fbda7ca09dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "https://images.unsplash.com/photo-1619792597637-2604bf70ee00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "https://images.unsplash.com/photo-1764162051300-1021c8277419?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  ];

  // Channel avatar images
  const channelAvatars = [
    "https://images.unsplash.com/photo-1593382067395-ace3045a1547?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
    "https://images.unsplash.com/photo-1558975285-193b2c315c2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
    "https://images.unsplash.com/photo-1649589244330-09ca58e4fa64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
    "https://images.unsplash.com/photo-1642610225765-a1cd62b7b565?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
  ];

  // Note: onPeriodChange is passed as prop and should be implemented by parent component
  // The actual implementation comes from props

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{
        background:
          theme === "dark"
            ? "linear-gradient(to bottom right, #0a0a0a, #0f0f0f, #0a0a0a)"
            : "linear-gradient(to bottom right, #f5f5f7, #ffffff, #f5f5f7)",
        color: "var(--app-text)",
      }}
    >
      {/* Hero Section with Background Image */}
      <div className="relative overflow-hidden h-80">
        {/* Background Image */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1760780567530-389d8a3fba75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
            alt="Creator workspace"
            className="w-full h-full object-cover"
          />
          <div
            className={`absolute inset-0 ${
              theme === "dark"
                ? "bg-gradient-to-r from-black/90 via-black/70 to-black/90"
                : "bg-gradient-to-r from-white/90 via-white/70 to-white/90"
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--app-bg)]" />
        </div>

        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />

        <div className="relative p-8 h-full flex flex-col justify-center">
          <div>
            <div className="inline-block px-4 py-2 rounded-full bg-red-600/20 border border-red-500/30 mb-4">
              <span className="text-red-500 text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                Live Dashboard
              </span>
            </div>
            <h1
              className={`text-6xl mb-3 ${
                theme === "dark"
                  ? "bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent"
                  : "text-gray-900"
              }`}
            >
              Welcome,{" "}
              <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent font-extrabold">
                Billy
              </span>
            </h1>
            <p
              style={{ color: "var(--app-text-muted)" }}
              className="text-xl max-w-2xl"
            >
              Your content is performing exceptionally well this month. Track
              your growth, manage earnings, and engage with your audience.
            </p>
          </div>
        </div>
      </div>

      <div className="px-8 -mt-8">
        {/* Main Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Balance Card */}
          <div
            className="relative overflow-hidden backdrop-blur-xl bg-white/10 rounded-2xl p-6 group cursor-pointer border border-white/20 shadow-xl shadow-black/20"
            style={{
              backgroundColor: "var(--app-card-bg)",
              border: "1px solid var(--app-card-border)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <DollarSign className="w-6 h-6 text-green-400" />
                </div>
                <div className="flex items-center gap-1 text-green-400 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>12.5%</span>
                </div>
              </div>
              <p
                style={{ color: "var(--app-text-muted)" }}
                className="text-sm mb-1"
              >
                Total Balance
              </p>
              <p className="text-3xl font-bold" style={{ color: "var(--app-text)" }}>
                ${(metrics.totalBalance ?? 0).toLocaleString()}
              </p>
              <p className="text-green-400 text-xs mt-2">
                Available for withdrawal
              </p>
            </div>
          </div>

          {/* Total Paid Out Card */}
          <div
            className="relative overflow-hidden backdrop-blur-xl bg-white/10 rounded-2xl p-6 group cursor-pointer border border-white/20 shadow-xl shadow-black/20"
            style={{
              backgroundColor: "var(--app-card-bg)",
              border: "1px solid var(--app-card-border)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Wallet className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="flex items-center gap-1 text-yellow-400 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>8.2%</span>
                </div>
              </div>
              <p
                style={{ color: "var(--app-text-muted)" }}
                className="text-sm mb-1"
              >
                Total Paid Out
              </p>
              <p className="text-3xl font-bold" style={{ color: "var(--app-text)" }}>
                ${(metrics.totalPaidOut ?? 0).toLocaleString()}
              </p>
              <p className="text-yellow-400 text-xs mt-2">Lifetime earnings</p>
            </div>
          </div>

          {/* Total Views Card */}
          <div
            className="relative overflow-hidden backdrop-blur-xl bg-white/10 rounded-2xl p-6 group cursor-pointer border border-white/20 shadow-xl shadow-black/20"
            style={{
              backgroundColor: "var(--app-card-bg)",
              border: "1px solid var(--app-card-border)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Eye className="w-6 h-6 text-red-400" />
                </div>
                <div className="flex items-center gap-1 text-red-400 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>24.8%</span>
                </div>
              </div>
              <p
                style={{ color: "var(--app-text-muted)" }}
                className="text-sm mb-1"
              >
                Total Views This Week
              </p>
              <p className="text-3xl font-bold" style={{ color: "var(--app-text)" }}>
                {(metrics.views ?? 0).toLocaleString()}
              </p>
              <p className="text-red-400 text-xs mt-2">
                {viewsDiffPct}% vs last week
              </p>
            </div>
          </div>

          {/* Watch Time Card */}
          <div
            className="relative overflow-hidden backdrop-blur-xl bg-white/10 rounded-2xl p-6 group cursor-pointer border border-white/20 shadow-xl shadow-black/20"
            style={{
              backgroundColor: "var(--app-card-bg)",
              border: "1px solid var(--app-card-border)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="flex items-center gap-1 text-yellow-400 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>16.3%</span>
                </div>
              </div>
              <p
                style={{ color: "var(--app-text-muted)" }}
                className="text-sm mb-1"
              >
                Watch Time
              </p>
              <p className="text-3xl font-bold" style={{ color: "var(--app-text)" }}>
                {metrics.watchTime}
              </p>
              <p className="text-yellow-400 text-xs mt-2">
                Engagement rate: 72%
              </p>
            </div>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div
            className="rounded-xl p-6 transition-all duration-300 backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl shadow-black/20"
            style={{
              backgroundColor: "var(--app-card-bg)",
              border: "1px solid var(--app-card-border)",
            }}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-yellow-600 rounded-xl flex items-center justify-center">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <p
                  style={{ color: "var(--app-text-muted)" }}
                  className="text-sm"
                >
                  Subscribers
                </p>
                <p
                  className="text-2xl font-semibold"
                  style={{ color: "var(--app-text)" }}
                >
                  {(metrics.subscribers ?? 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div
            className="rounded-xl p-6 transition-all duration-300 backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl shadow-black/20"
            style={{
              backgroundColor: "var(--app-card-bg)",
              border: "1px solid var(--app-card-border)",
            }}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-yellow-600 rounded-xl flex items-center justify-center">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
              <div>
                <p
                  style={{ color: "var(--app-text-muted)" }}
                  className="text-sm"
                >
                  Subscription Earnings
                </p>
                <p className="text-2xl" style={{ color: "var(--app-text)" }}>
                  $
                  {(metrics.subscriptionEarningsPerMonth ?? 0).toLocaleString()}
                  /mo
                </p>
              </div>
            </div>
          </div>

          <div
            className="rounded-xl p-6 transition-all duration-300 backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl shadow-black/20"
            style={{
              backgroundColor: "var(--app-card-bg)",
              border: "1px solid var(--app-card-border)",
            }}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-600 to-red-600 rounded-xl flex items-center justify-center">
                <Eye className="w-7 h-7 text-white" />
              </div>
              <div>
                <p
                  style={{ color: "var(--app-text-muted)" }}
                  className="text-sm"
                >
                  Pay Per View
                </p>
                <p className="text-2xl" style={{ color: "var(--app-text)" }}>
                  ${metrics.payPerView.toFixed(4)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Viewed Videos - Netflix/YouTube Style */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2
                className="text-3xl mb-1 font-bold"
                style={{ color: "var(--app-text)" }}
              >
                Top Performing Content
              </h2>
              <p style={{ color: "var(--app-text-muted)" }}>
                Your most viewed videos this month
              </p>
            </div>
            <button
              onClick={() => router.push("/videos")}
              className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors"
            >
              <span>View All</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {metrics.topViewedVideos.map((video, index) => (
              <div
                key={index}
                className="group relative rounded-xl p-6 transition-all duration-300 cursor-pointer backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl shadow-black/20"
                style={{
                  backgroundColor: "var(--app-card-bg)",
                  border: "1px solid var(--app-card-border)",
                }}
                onClick={() =>
                  router.push(`/videos?video=${video.id ?? `top-${index}`}`)
                }
              >
                <div className="flex items-start gap-6">
                  {/* Rank Badge */}
                  <div className="flex-shrink-0">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                        index === 0
                          ? "bg-gradient-to-br from-yellow-600 to-red-600 text-white"
                          : index === 1
                          ? "bg-gradient-to-br from-yellow-600 to-red-600 text-white"
                          : index === 2
                          ? "bg-gradient-to-br from-yellow-800 to-yellow-900 text-white"
                          : "bg-red-800 text-red-400"
                      }`}
                    >
                      #{index + 1}
                    </div>
                  </div>

                  {/* Video Thumbnail */}
                  <div className="flex-shrink-0 w-48 h-28 rounded-lg overflow-hidden relative group-hover:scale-105 transition-transform duration-300 shadow-lg">
                    <ImageWithFallback
                      src={videoThumbnails[index]}
                      alt={video.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                        <Play
                          className="w-6 h-6 text-white ml-1"
                          fill="white"
                        />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/90 px-2 py-1 rounded text-xs text-white">
                      {Math.floor(Math.random() * 30 + 5)}:
                      {Math.floor(Math.random() * 60)
                        .toString()
                        .padStart(2, "0")}
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className="text-lg mb-3 group-hover:text-red-500 transition-colors"
                      style={{ color: "var(--app-text)" }}
                    >
                      {video.name}
                    </h3>

                    <div
                      className="flex flex-wrap items-center gap-4 text-sm"
                      style={{ color: "var(--app-text-muted)" }}
                    >
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {(video.views ?? 0).toLocaleString()} views
                      </span>
                      <span>•</span>
                      <span>{Math.floor(Math.random() * 7 + 1)} days ago</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-green-400">
                        <TrendingUp className="w-4 h-4" />+
                        {(Math.random() * 20 + 5).toFixed(1)}%
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 bg-red-500/20 text-red-400 text-sm rounded-full">
                        Trending
                      </span>
                      <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm rounded-full">
                        Entertainment
                      </span>
                    </div>
                  </div>

                  {/* Revenue */}
                  <div className="flex-shrink-0 text-right">
                    <p className="text-green-400 text-2xl font-bold">
                      $
                      {((video.views ?? 0) * (metrics.payPerView ?? 0)).toFixed(
                        2
                      )}
                    </p>
                    <p className="text-gray-500 text-sm">revenue</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Withdraw CTA */}
        <div
          className="relative overflow-hidden backdrop-blur-xl bg-white/10 rounded-2xl p-8 mb-8 border border-white/20 shadow-xl shadow-black/20"
          style={{
            backgroundColor: "var(--app-card-bg)",
            border: "1px solid var(--app-card-border)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-yellow-600/10" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 rounded-full blur-3xl" />

          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="text-3xl mb-2 font-bold">
                <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                  Ready to withdraw?
                </span>
              </h2>
              <p
                className="text-lg max-w-2xl mb-4"
                style={{ color: "var(--app-text-muted)" }}
              >
                You have{" "}
                <span
                  className="font-semibold"
                  style={{ color: "var(--app-text)" }}
                >
                  ${(metrics.totalBalance ?? 0).toLocaleString()}
                </span>{" "}
                available for withdrawal. Funds typically arrive within 3-5
                business days.
              </p>
              <div
                className="flex items-center gap-2 text-sm"
                style={{ color: "var(--app-text-muted)" }}
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Instant transfer available</span>
              </div>
            </div>
            <button
              onClick={onWithdraw}
              className="flex-shrink-0 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-xl flex items-center gap-3 transition-all duration-300 shadow-lg shadow-red-600/30"
            >
              <Wallet className="w-5 h-5" />
              <span className="text-lg">Withdraw Funds</span>
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSelectedVideo(null)}
          />

          <div className="relative max-w-6xl w-full mx-4 z-10">
            <div
              className="rounded-2xl p-6 shadow-2xl"
              style={{
                backgroundColor: "var(--app-card-bg)",
                border: "1px solid var(--app-card-border)",
              }}
            >
              <button
                onClick={() => setSelectedVideo(null)}
                className="flex items-center gap-2 mb-4 text-sm text-gray-300"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-6">
                    <img
                      src={selectedVideo.thumbnail}
                      alt={selectedVideo.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-white/90 to-white/70 rounded-full flex items-center justify-center">
                        <Play className="w-10 h-10 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-black/90 px-3 py-1 rounded-lg text-sm text-white">
                      {Math.floor(Math.random() * 30 + 5)}:
                      {Math.floor(Math.random() * 60)
                        .toString()
                        .padStart(2, "0")}
                    </div>
                  </div>

                  <h2
                    className="text-2xl mb-3"
                    style={{ color: "var(--app-text)" }}
                  >
                    {selectedVideo.title}
                  </h2>

                  <div
                    className="flex items-center gap-4 mb-6"
                    style={{ color: "var(--app-text-muted)" }}
                  >
                    <span className="flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      {selectedVideo.views.toLocaleString()} views
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      {selectedVideo.createdAt.toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-400 rounded-full text-xs backdrop-blur-sm">
                      <CheckCircle className="w-3 h-3" />
                      <span>
                        {selectedVideo.status === "active"
                          ? "Active"
                          : selectedVideo.status === "abuseReported"
                          ? "Under Review"
                          : "Blocked"}
                      </span>
                    </div>
                  </div>

                  <div
                    className="p-4 rounded-xl mb-4"
                    style={{
                      backgroundColor: "var(--app-card-bg)",
                      border: "1px solid var(--app-card-border)",
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-yellow-600 rounded-full flex items-center justify-center text-xl text-white">
                        {selectedVideo.channelName?.[0]}
                      </div>
                      <div>
                        <h3
                          className="mb-1 font-bold"
                          style={{ color: "var(--app-text)" }}
                        >
                          {selectedVideo.channelName}
                        </h3>
                        <p
                          className="text-sm"
                          style={{ color: "var(--app-text-muted)" }}
                        >
                          Playlist: {selectedVideo.playlistName}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div
                    className="rounded-xl p-6"
                    style={{
                      backgroundColor: "var(--app-card-bg)",
                      border: "1px solid var(--app-card-border)",
                    }}
                  >
                    <h3
                      className="text-lg mb-4"
                      style={{ color: "var(--app-text)" }}
                    >
                      Performance
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span style={{ color: "var(--app-text-muted)" }}>
                          Views
                        </span>
                        <span style={{ color: "var(--app-text)" }}>
                          {selectedVideo.views.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span style={{ color: "var(--app-text-muted)" }}>
                          Engagement
                        </span>
                        <span className="text-green-400">+24.5%</span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span style={{ color: "var(--app-text-muted)" }}>
                          Likes
                        </span>
                        <span style={{ color: "var(--app-text)" }}>
                          {selectedVideo.likes?.toLocaleString() || "0"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    className="rounded-xl p-6"
                    style={{
                      backgroundColor: "var(--app-card-bg)",
                      border: "1px solid var(--app-card-border)",
                    }}
                  >
                    <h3
                      className="text-lg mb-4"
                      style={{ color: "var(--app-text)" }}
                    >
                      Earnings
                    </h3>
                    <p className="text-3xl text-green-400 mb-2">
                      ${(selectedVideo.views * 0.0024).toFixed(2)}
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: "var(--app-text-muted)" }}
                    >
                      From this video
                    </p>
                  </div>

                  {/* Comments Section */}
                  <div
                    className="rounded-xl p-6"
                    style={{
                      backgroundColor: "var(--app-card-bg)",
                      border: "1px solid var(--app-card-border)",
                    }}
                  >
                    <h3
                      className="text-lg mb-4"
                      style={{ color: "var(--app-text)" }}
                    >
                      Comments
                    </h3>
                    <div className="space-y-4">
                      {selectedVideo.comments?.length > 0 ? (
                        selectedVideo.comments.map((comment: any) => (
                          <div
                            key={comment.id}
                            className="flex gap-3 p-3 rounded-lg"
                            style={{
                              backgroundColor: "var(--app-card-bg)",
                              border: "1px solid var(--app-card-border)",
                            }}
                          >
                            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-yellow-600 rounded-full flex items-center justify-center text-sm text-white flex-shrink-0">
                              {comment.username?.[0] || "U"}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span
                                  className="font-medium"
                                  style={{ color: "var(--app-text)" }}
                                >
                                  {comment.username}
                                </span>
                                <span
                                  className="text-xs"
                                  style={{ color: "var(--app-text-muted)" }}
                                >
                                  {comment.createdAt.toLocaleDateString()}
                                </span>
                              </div>
                              <p
                                className="text-sm"
                                style={{ color: "var(--app-text-muted)" }}
                              >
                                {comment.content}
                              </p>
                              <div className="flex items-center gap-4 mt-2">
                                <span className="text-xs text-green-400">
                                  {comment.likes} likes
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p
                          className="text-sm"
                          style={{ color: "var(--app-text-muted)" }}
                        >
                          No comments yet
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
