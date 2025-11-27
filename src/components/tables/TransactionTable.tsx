"use client";

import { useState, useMemo } from "react";
import { Transaction } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatDateWithTime } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

interface TransactionTableProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

export const TransactionTable = ({
  transactions,
  isLoading,
}: TransactionTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState<
    "all" | "donation" | "payment_link" | "payment_request"
  >("all");
  const itemsPerPage = 10;

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch =
        t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.fromUser?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter = filterType === "all" || t.type === filterType;

      return matchesSearch && matchesFilter;
    });
  }, [transactions, searchTerm, filterType]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const statusColors = {
    completed:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  const typeLabels = {
    donation: "Donation",
    payment_link: "Payment Link",
    payment_request: "Payment Request",
  };

  return (
    <Card>
      <CardHeader>
        <div className="space-y-4">
          <div>
            <CardTitle>Transactions</CardTitle>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-10"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value as any);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 h-10"
            >
              <option value="all" className="bg-background text-foreground dark:bg-gray-800 dark:text-white">All Types</option>
              <option value="donation" className="bg-background text-foreground dark:bg-gray-800 dark:text-white">Donation</option>
              <option value="payment_link" className="bg-background text-foreground dark:bg-gray-800 dark:text-white">Payment Link</option>
              <option value="payment_request" className="bg-background text-foreground dark:bg-gray-800 dark:text-white">Payment Request</option>
            </select>
            <Button variant="outline" size="sm">
              <Search size={16} />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-sm">
                      Description
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">
                      From
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-sm">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTransactions.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No transactions found
                      </td>
                    </tr>
                  ) : (
                    paginatedTransactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="border-b border-border hover:bg-secondary/30 transition"
                      >
                        <td className="py-4 px-4 text-sm">
                          {transaction.description || "—"}
                        </td>
                        <td className="py-4 px-4 text-sm flex items-center gap-2">
                          {transaction.fromUser?.profileImage && (
                            <img
                              src={transaction.fromUser.profileImage}
                              alt="User"
                              className="w-6 h-6 rounded-full"
                            />
                          )}
                          {transaction.fromUser?.username || "Unknown"}
                        </td>
                        <td className="py-4 px-4 text-sm font-semibold text-right">
                          {formatCurrency(transaction.amount)}
                        </td>
                        <td className="py-4 px-4 text-sm">
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            {typeLabels[transaction.type]}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm">
                          <span
                            className={`text-xs px-2 py-1 rounded font-medium ${
                              statusColors[transaction.status]
                            }`}
                          >
                            {transaction.status.charAt(0).toUpperCase() +
                              transaction.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-muted-foreground">
                          {formatDateWithTime(transaction.createdAt)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Showing{" "}
                  {Math.min(
                    (currentPage - 1) * itemsPerPage + 1,
                    filteredTransactions.length
                  )}{" "}
                  to{" "}
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredTransactions.length
                  )}{" "}
                  of {filteredTransactions.length} results
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    {currentPage} / {totalPages}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

