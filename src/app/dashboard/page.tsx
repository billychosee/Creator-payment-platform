"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { StatCard } from "@/components/cards/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DollarSign, TrendingUp, Clock, Zap } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { generateMockChartData, getMockDashboardStats } from "@/services/mock";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const [period, setPeriod] = useState<
    "daily" | "weekly" | "monthly" | "yearly"
  >("daily");
  const [isLoading, setIsLoading] = useState(false);

  const stats = getMockDashboardStats();
  const chartData = generateMockChartData(period);

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
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Welcome back! 👋</h1>
          <p className="text-muted-foreground mt-2">
            Here's your performance overview
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Earnings"
            value={formatCurrency(stats.totalEarnings)}
            icon={DollarSign}
            trend={{ value: 12, isPositive: true }}
            subtext="All time"
          />
          <StatCard
            title="Today's Earnings"
            value={formatCurrency(stats.todayEarnings)}
            icon={TrendingUp}
            trend={{ value: 5, isPositive: true }}
            subtext="Last 24 hours"
          />
          <StatCard
            title="Pending Payouts"
            value={formatCurrency(stats.pendingPayouts)}
            icon={Clock}
            subtext="Ready to withdraw"
          />
          <StatCard
            title="Total Transactions"
            value={stats.totalTransactions}
            icon={Zap}
            trend={{ value: 8, isPositive: true }}
            subtext="All transactions"
          />
        </div>

        {/* Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Earnings Over Time</CardTitle>
            <div className="flex gap-2">
              {(["daily", "weekly", "monthly", "yearly"] as const).map((p) => (
                <Button
                  key={p}
                  variant={period === p ? "primary" : "outline"}
                  size="sm"
                  onClick={() => handlePeriodChange(p)}
                  disabled={isLoading}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-80 bg-muted rounded animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    stroke="currentColor"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis stroke="currentColor" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="earnings"
                    stroke="hsl(var(--primary))"
                    name="Earnings ($)"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))" }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="transactions"
                    stroke="hsl(var(--accent))"
                    name="Transactions"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--accent))" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6 space-y-3">
              <h3 className="font-semibold">Create Payment Link</h3>
              <p className="text-sm text-muted-foreground">
                Generate a link for supporters to send you money
              </p>
              <Button variant="outline" className="w-full">
                Create Now
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 space-y-3">
              <h3 className="font-semibold">Request Payment</h3>
              <p className="text-sm text-muted-foreground">
                Ask a brand or client to pay for your work
              </p>
              <Button variant="outline" className="w-full">
                Request Now
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 space-y-3">
              <h3 className="font-semibold">Withdraw Funds</h3>
              <p className="text-sm text-muted-foreground">
                Receive your earnings to your bank account
              </p>
              <Button variant="outline" className="w-full">
                Withdraw
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
