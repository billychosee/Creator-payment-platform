"use client";

import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { TransactionTable } from "@/components/tables/TransactionTable";
import { MOCK_TRANSACTIONS } from "@/services/mock";

export default function TransactionsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-muted-foreground mt-2">
            View and manage all your transactions
          </p>
        </div>

        <TransactionTable transactions={MOCK_TRANSACTIONS} />
      </div>
    </DashboardLayout>
  );
}
