"use client";

import { Payout } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatCurrency, formatDate } from "@/lib/utils";

interface PayoutTableProps {
  payouts: Payout[];
  isLoading?: boolean;
}

export const PayoutTable = ({ payouts, isLoading }: PayoutTableProps) => {
  const statusColors = {
    pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    processing:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    completed:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  const methodLabels = {
    bank_transfer: "Bank Transfer",
    paypal: "PayPal",
    stripe: "Stripe",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payout History</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-sm">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">
                    Method
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">
                    Requested
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">
                    Completed
                  </th>
                </tr>
              </thead>
              <tbody>
                {payouts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No payouts yet
                    </td>
                  </tr>
                ) : (
                  payouts.map((payout) => (
                    <tr
                      key={payout.id}
                      className="border-b border-border hover:bg-secondary/30 transition"
                    >
                      <td className="py-4 px-4 text-sm font-semibold">
                        {formatCurrency(payout.amount)}
                      </td>
                      <td className="py-4 px-4 text-sm">
                        {methodLabels[payout.method]}
                      </td>
                      <td className="py-4 px-4 text-sm">
                        <span
                          className={`text-xs px-2 py-1 rounded font-medium ${
                            statusColors[payout.status]
                          }`}
                        >
                          {payout.status.charAt(0).toUpperCase() +
                            payout.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">
                        {formatDate(payout.createdAt)}
                      </td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">
                        {payout.completedAt
                          ? formatDate(payout.completedAt)
                          : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

