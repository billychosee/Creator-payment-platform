"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { PayoutTable } from "@/components/tables/PayoutTable";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MOCK_PAYOUTS, getMockDashboardStats } from "@/services/mock";
import { formatCurrency } from "@/lib/utils";
import { Send } from "lucide-react";

export default function PayoutsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const stats = getMockDashboardStats();

  const handleWithdraw = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold">Payouts</h1>
          <p className="text-muted-foreground mt-2">
            Manage your payouts and withdrawal history
          </p>
        </div>

        {/* Payout Summary */}
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Available Balance
                </p>
                <p className="text-3xl font-bold">
                  {formatCurrency(stats.pendingPayouts)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Monthly Earnings
                </p>
                <p className="text-3xl font-bold">
                  {formatCurrency(stats.totalEarnings)}
                </p>
              </div>
            </div>

            <Button
              onClick={handleWithdraw}
              isLoading={isLoading}
              className="w-full gap-2"
            >
              <Send size={18} />
              Withdraw Now
            </Button>
          </CardContent>
        </Card>

        {/* Payout History */}
        <PayoutTable payouts={MOCK_PAYOUTS} />
      </div>
    </DashboardLayout>
  );
}
