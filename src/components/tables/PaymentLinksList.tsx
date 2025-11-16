"use client";

import { useState, useMemo } from "react";
import { PaymentLink } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { DatePicker } from "@/components/ui/DatePicker";
import { formatDateWithTime } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Search, ExternalLink, Calendar } from "lucide-react";

interface PaymentLinksListProps {
  paymentLinks: PaymentLink[];
  isLoading?: boolean;
}

export const PaymentLinksList = ({
  paymentLinks,
  isLoading,
}: PaymentLinksListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive" | "expired">("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const itemsPerPage = 10;

  const filteredPaymentLinks = useMemo(() => {
    return paymentLinks.filter((link) => {
      const matchesSearch =
        link.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filterStatus === "all" || link.status === filterStatus;

      // Date filtering
      let matchesDateRange = true;
      if (startDate && endDate) {
        const linkDate = new Date(link.createdAt);
        const start = new Date(startDate);
        const end = new Date(endDate);
        // Add 1 day to end date to include the entire end date
        end.setDate(end.getDate() + 1);
        matchesDateRange = linkDate >= start && linkDate < end;
      } else if (startDate) {
        const linkDate = new Date(link.createdAt);
        const start = new Date(startDate);
        matchesDateRange = linkDate >= start;
      } else if (endDate) {
        const linkDate = new Date(link.createdAt);
        const end = new Date(endDate);
        end.setDate(end.getDate() + 1);
        matchesDateRange = linkDate < end;
      }

      return matchesSearch && matchesStatus && matchesDateRange;
    });
  }, [paymentLinks, searchTerm, filterStatus, startDate, endDate]);

  const totalPages = Math.ceil(filteredPaymentLinks.length / itemsPerPage);
  const paginatedPaymentLinks = filteredPaymentLinks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const statusColors = {
    active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    inactive: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    expired: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  const clearDateFilters = () => {
    setStartDate("");
    setEndDate("");
  };

  const hasActiveFilters = startDate || endDate;

  return (
    <Card>
      <CardHeader>
        <div className="space-y-4">
          <div>
            <CardTitle>Payment Links</CardTitle>
          </div>
          
          {/* Search and Filters */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Search payment links..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-10"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value as any);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-border rounded-lg text-sm h-10 bg-background text-foreground dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              >
                <option value="all" className="bg-background text-foreground dark:bg-gray-800 dark:text-white">All Status</option>
                <option value="active" className="bg-background text-foreground dark:bg-gray-800 dark:text-white">Active</option>
                <option value="inactive" className="bg-background text-foreground dark:bg-gray-800 dark:text-white">Inactive</option>
                <option value="expired" className="bg-background text-foreground dark:bg-gray-800 dark:text-white">Expired</option>
              </select>
              <Button variant="outline" size="sm">
                <Search size={16} />
                Export CSV
              </Button>
            </div>
            
            {/* Date Filters */}
            <div className="flex flex-col sm:flex-row gap-3 items-end">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(date) => {
                    setStartDate(date);
                    setCurrentPage(1);
                  }}
                  placeholder="mm/dd/yyyy"
                />
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(date) => {
                    setEndDate(date);
                    setCurrentPage(1);
                  }}
                  placeholder="mm/dd/yyyy"
                />
              </div>
              {hasActiveFilters && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={clearDateFilters}
                  className="flex items-center gap-2 h-10"
                >
                  <Calendar size={16} />
                  Clear Dates
                </Button>
              )}
            </div>
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
                      Name
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">
                      Reference
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">
                      Currency
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">
                      Created
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPaymentLinks.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No payment links found
                      </td>
                    </tr>
                  ) : (
                    paginatedPaymentLinks.map((link) => (
                      <tr
                        key={link.id}
                        className="border-b border-border hover:bg-secondary/30 transition"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            {link.logo && (
                              <img
                                src={link.logo}
                                alt="Logo"
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            )}
                            <div>
                              <p className="font-medium text-sm">{link.name}</p>
                              <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                {link.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm font-mono">
                          {link.reference}
                        </td>
                        <td className="py-4 px-4 text-sm">
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                            {link.currency}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm">
                          <span
                            className={`text-xs px-2 py-1 rounded font-medium ${
                              statusColors[link.status]
                            }`}
                          >
                            {link.status.charAt(0).toUpperCase() +
                              link.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-muted-foreground">
                          {formatDateWithTime(link.createdAt)}
                        </td>
                        <td className="py-4 px-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(link.shareUrl, '_blank')}
                              className="flex items-center gap-1"
                            >
                              <ExternalLink size={12} />
                              View
                            </Button>
                          </div>
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
                    filteredPaymentLinks.length
                  )}{" "}
                  to{" "}
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredPaymentLinks.length
                  )}{" "}
                  of {filteredPaymentLinks.length} results
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