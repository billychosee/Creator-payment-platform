"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { Report } from "@/types";

interface ReportsProps {
  reports: Report[];
}

export default function ReportsPage() {
  const router = useRouter();
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Mock data for now
  const [reports] = useState<Report[]>([
    {
      id: "1",
      userId: "user1",
      title: "Copyright Infringement",
      description:
        "This video contains copyrighted material without permission",
      category: "Copyright",
      moderation: "Content Review Team",
      resolutionNotes: "Video has been removed pending further investigation",
      reportStatus: "in_progress",
      createdAt: new Date("2024-01-15"),
      resolvedAt: null,
    },
    {
      id: "2",
      userId: "user2",
      title: "Harassment and Bullying",
      description: "User is engaging in targeted harassment of other creators",
      category: "Harassment",
      moderation: "Community Guidelines Team",
      resolutionNotes: "Account has been temporarily suspended",
      reportStatus: "resolved",
      createdAt: new Date("2024-01-10"),
      resolvedAt: new Date("2024-01-12"),
    },
    {
      id: "3",
      userId: "user3",
      title: "Spam Content",
      description: "Multiple accounts posting identical spam content",
      category: "Spam",
      moderation: "Anti-Spam Team",
      resolutionNotes: "Spam accounts have been banned",
      reportStatus: "resolved",
      createdAt: new Date("2024-01-05"),
      resolvedAt: new Date("2024-01-06"),
    },
    {
      id: "4",
      userId: "user4",
      title: "Misinformation",
      description: "Video contains false information about health topics",
      category: "Misinformation",
      moderation: "Content Review Team",
      reportStatus: "pending",
      createdAt: new Date("2024-01-01"),
      resolvedAt: null,
    },
  ]);

  const getStatusConfig = (status: Report["reportStatus"]) => {
    switch (status) {
      case "pending":
        return {
          color: "yellow",
          icon: Clock,
          bg: "from-yellow-600/20 to-red-600/20",
          border: "border-yellow-500/20",
          text: "text-yellow-400",
          badge: "bg-yellow-500/10",
        };
      case "in_progress":
        return {
          color: "yellow",
          icon: AlertTriangle,
          bg: "from-yellow-600/20 to-red-600/20",
          border: "border-yellow-500/20",
          text: "text-yellow-400",
          badge: "bg-yellow-500/10",
        };
      case "resolved":
        return {
          color: "green",
          icon: CheckCircle,
          bg: "from-green-600/20 to-yellow-600/20",
          border: "border-green-500/20",
          text: "text-green-400",
          badge: "bg-green-500/10",
        };
      case "rejected":
        return {
          color: "gray",
          icon: XCircle,
          bg: "from-red-600/20 to-yellow-600/20",
          border: "border-red-500/20",
          text: "text-gray-400",
          badge: "bg-gray-500/10",
        };
    }
  };

  if (selectedReport) {
    const config = getStatusConfig(selectedReport.reportStatus);
    const StatusIcon = config.icon;

    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-background text-foreground p-8">
          <Button
            onClick={() => setSelectedReport(null)}
            variant="ghost"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Reports</span>
          </Button>

          <div className="max-w-4xl mx-auto">
            {/* Report Hero */}
            <div
              className={`relative overflow-hidden bg-gradient-to-br ${config.bg} border ${config.border} rounded-3xl p-12 mb-8 animate-fade-in`}
            >
              <div className="flex items-start gap-8">
                <div
                  className={`w-20 h-20 ${config.badge} rounded-2xl flex items-center justify-center`}
                >
                  <StatusIcon className={`w-10 h-10 ${config.text}`} />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl text-foreground mb-3 font-bold">
                    {selectedReport.title}
                  </h1>
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 ${config.badge} rounded-full ${config.text} text-sm capitalize`}
                  >
                    <StatusIcon className="w-4 h-4" />
                    <span>{selectedReport.reportStatus.replace("-", " ")}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Report Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div
                className="bg-card border border-border rounded-2xl p-6 animate-fade-in"
                style={{ animationDelay: "0.1s" }}
              >
                <p className="text-muted-foreground text-sm mb-2">Category</p>
                <p className="text-xl text-foreground font-bold">
                  {selectedReport.category}
                </p>
              </div>
              <div
                className="bg-card border border-border rounded-2xl p-6 animate-fade-in"
                style={{ animationDelay: "0.2s" }}
              >
                <p className="text-muted-foreground text-sm mb-2">Created</p>
                <p className="text-xl text-foreground font-bold">
                  {selectedReport.createdAt.toLocaleDateString()}
                </p>
              </div>
              <div
                className="bg-card border border-border rounded-2xl p-6 animate-fade-in"
                style={{ animationDelay: "0.3s" }}
              >
                <p className="text-muted-foreground text-sm mb-2">Resolved</p>
                <p className="text-xl text-foreground font-bold">
                  {selectedReport.resolvedAt
                    ? selectedReport.resolvedAt.toLocaleDateString()
                    : "Pending"}
                </p>
              </div>
            </div>

            {/* Description & Resolution */}
            <div className="space-y-6">
              <div
                className="bg-card border border-border rounded-2xl p-8 animate-fade-in"
                style={{ animationDelay: "0.4s" }}
              >
                <h2 className="text-xl mb-4 font-bold">Description</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {selectedReport.description}
                </p>
              </div>

              <div
                className="bg-card border border-border rounded-2xl p-8 animate-fade-in"
                style={{ animationDelay: "0.5s" }}
              >
                <h2 className="text-xl mb-4 font-bold">Moderation</h2>
                <p className="text-muted-foreground font-bold">
                  {selectedReport.moderation}
                </p>
              </div>

              {selectedReport.resolutionNotes && (
                <div
                  className="bg-gradient-to-br from-green-600/10 to-yellow-600/10 border border-green-500/20 rounded-2xl p-8 animate-fade-in"
                  style={{ animationDelay: "0.6s" }}
                >
                  <h2 className="text-xl mb-4 text-green-400 font-bold">
                    Resolution Notes
                  </h2>
                  <p className="text-muted-foreground font-bold">
                    {selectedReport.resolutionNotes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const pendingCount = reports.filter(
    (r) => r.reportStatus === "pending"
  ).length;
  const inReviewCount = reports.filter(
    (r) => r.reportStatus === "in_progress"
  ).length;
  const resolvedCount = reports.filter(
    (r) => r.reportStatus === "resolved"
  ).length;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background text-foreground p-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl mb-2 font-bold">Reports & Moderation</h1>
          <p className="text-muted-foreground">
            Manage content reports and moderation issues
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-card border border-border rounded-2xl p-6 animate-fade-in">
            <p className="text-muted-foreground text-sm mb-2 font-bold">Total Reports</p>
            <p className="text-3xl text-foreground font-bold">{reports.length}</p>
          </div>
          <div
            className="bg-gradient-to-br from-yellow-600/20 to-red-600/20 border border-yellow-500/20 rounded-2xl p-6 animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            <p className="text-muted-foreground text-sm mb-2 font-bold">Pending</p>
            <p className="text-3xl text-yellow-400 font-bold">{pendingCount}</p>
          </div>
          <div
            className="bg-gradient-to-br from-yellow-600/20 to-red-600/20 border border-yellow-500/20 rounded-2xl p-6 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <p className="text-muted-foreground text-sm mb-2 font-bold">In Review</p>
            <p className="text-3xl text-green-400 font-bold">{inReviewCount}</p>
          </div>
          <div
            className="bg-gradient-to-br from-green-600/20 to-yellow-600/20 border border-green-500/20 rounded-2xl p-6 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <p className="text-muted-foreground text-sm mb-2 font-bold">Resolved</p>
            <p className="text-3xl text-green-400 font-bold">{resolvedCount}</p>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {reports.map((report, index) => {
            const config = getStatusConfig(report.reportStatus);
            const StatusIcon = config.icon;

            return (
              <div
                key={report.id}
                className={`group bg-card border border-border rounded-2xl p-6 hover:${config.border} transition-all duration-300 cursor-pointer animate-fade-in`}
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => setSelectedReport(report)}
              >
                <div className="flex items-start gap-6">
                  <div
                    className={`flex-shrink-0 w-14 h-14 ${config.badge} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <StatusIcon className={`w-7 h-7 ${config.text}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3
                        className={`text-lg text-foreground group-hover:${config.text} transition-colors font-bold`}
                      >
                        {report.title}
                      </h3>
                      <span
                        className={`px-3 py-1 ${config.badge} ${config.text} rounded-full text-xs capitalize whitespace-nowrap font-bold`}
                      >
                        {report.reportStatus.replace("-", " ")}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2 font-bold">
                      {report.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground font-bold">
                      <span>Category: {report.category}</span>
                      <span>•</span>
                      <span>
                        Created: {report.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
