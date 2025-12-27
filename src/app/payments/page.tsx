"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
  CreditCard,
  Link as LinkIcon,
  DollarSign,
  Users,
  Calendar,
  Download,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { PaymentLinkFormModal } from "@/components/forms/PaymentLinkForm";
import router from "next/router";

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState<
    "payment-links" | "transactions" | "payouts"
  >("payment-links");
  const [showPaymentLinkModal, setShowPaymentLinkModal] = useState(false);

  const tabs = [
    { id: "payment-links", label: "Payment Links", icon: LinkIcon },
    { id: "transactions", label: "Transactions", icon: DollarSign },
    { id: "payouts", label: "Payouts", icon: Users },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in px-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-3xl font-extrabold">Payments</h1>
          <p className="text-muted-foreground mt-2">
            Create payment links, manage transactions, and track payouts
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Side Menu */}
          <div className="flex lg:flex-col gap-2 border-b lg:border-b-0 lg:border-r border-border pb-4 lg:pb-0 lg:pr-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  variant={activeTab === tab.id ? "primary" : "ghost"}
                  className="flex items-center gap-2 whitespace-nowrap justify-start w-full"
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </Button>
              );
            })}
          </div>

          {/* Content */}
          <div className="flex-1 max-w-4xl">
            {/* Payments summary restored */}
            <div className="mb-6">
              <Card className="bg-gradient-to-r from-red-600/20 to-yellow-600/20 border-red-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-red-900 dark:text-red-100">
                    <DollarSign size={20} />
                    Payments Overview
                  </CardTitle>
                  <p className="text-red-700 dark:text-red-300">
                    Overview of earnings and payouts
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-card border border-border rounded-lg p-4">
                      <div className="text-sm text-muted-foreground mb-1">
                        Total Earnings
                      </div>
                      <div className="text-2xl font-extrabold">$2,400.00</div>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-4">
                      <div className="text-sm text-muted-foreground mb-1">
                        Available Balance
                      </div>
                      <div className="text-2xl font-extrabold">$1,700.00</div>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-4">
                      <div className="text-sm text-muted-foreground mb-1">
                        Monthly Earnings
                      </div>
                      <div className="text-2xl font-extrabold">$400.00</div>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-4">
                      <div className="text-sm text-muted-foreground mb-1">
                        Pending Payouts
                      </div>
                      <div className="text-2xl font-extrabold">$300.00</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {activeTab === "payment-links" && (
              <PaymentLinksContent
                setShowPaymentLinkModal={setShowPaymentLinkModal}
              />
            )}
            {activeTab === "transactions" && <TransactionsContent />}
            {activeTab === "payouts" && <PayoutsContent />}
          </div>
        </div>

        {/* Payment Link Modal */}
        <PaymentLinkFormModal
          isOpen={showPaymentLinkModal}
          onClose={() => setShowPaymentLinkModal(false)}
        />
      </div>
    </DashboardLayout>
  );
}

function PaymentLinksContent({
  setShowPaymentLinkModal,
}: {
  setShowPaymentLinkModal: (show: boolean) => void;
}) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const paymentLinks = [
    {
      id: 1,
      name: "Custom Art Commission",
      description: "Commission me for custom digital artwork",
      reference: "CUSTOM-ART",
      currency: "USD",
      status: "Active",
      created: "Nov 27, 2025, 12:48 PM",
    },
    {
      id: 2,
      name: "Consultation Session",
      description: "30-minute consultation for content strategy",
      reference: "CONSULT-30",
      currency: "USD",
      status: "Active",
      created: "Nov 25, 2025, 3:15 PM",
    },
    {
      id: 3,
      name: "Premium Content",
      description: "Access to premium content for 1 month",
      reference: "PREMIUM-1M",
      currency: "USD",
      status: "Inactive",
      created: "Nov 20, 2025, 10:30 AM",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="bg-gradient-to-r from-red-600/20 to-yellow-600/20 border-red-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-red-900 dark:text-red-100">
            <LinkIcon size={24} />
            Create Payment Link
          </CardTitle>
          <p className="text-red-700 dark:text-red-300">
            Generate a link for supporters to send you money
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className="flex-1 gap-2 bg-red-600 hover:bg-red-700 text-white"
              onClick={() => setShowPaymentLinkModal(true)}
            >
              <Plus size={16} />
              Create Now
            </Button>
            <Button
              variant="gradient"
              className="flex-1 gap-2"
              onClick={() => router.push("/payments/payment-request")}
            >
              <Users size={16} />
              Request Payment
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Links List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Payment Links</CardTitle>
            <p className="text-sm text-muted-foreground">
              Create and manage payment links for your services
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
                <Input
                  placeholder="Search payment links..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button variant="gradient" className="gap-2">
                <Download size={16} />
                Export CSV
              </Button>
            </div>
          </div>

          {/* Date Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap">
              <Calendar size={16} />
              Filter by date:
            </div>
            <div className="flex items-center gap-2 flex-1 min-w-[300px]">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Start Date"
                className="flex-1"
              />
              <span className="text-muted-foreground whitespace-nowrap">
                to
              </span>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="End Date"
                className="flex-1"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium">Name</th>
                  <th className="text-left py-3 px-4 font-medium">
                    Description
                  </th>
                  <th className="text-left py-3 px-4 font-medium">Reference</th>
                  <th className="text-left py-3 px-4 font-medium">Currency</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Created</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paymentLinks.map((link) => (
                  <tr key={link.id} className="border-b border-border">
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium">{link.name}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">
                      {link.description}
                    </td>
                    <td className="py-4 px-4 font-mono text-sm">
                      {link.reference}
                    </td>
                    <td className="py-4 px-4">{link.currency}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          link.status === "Active"
                            ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                        }`}
                      >
                        {link.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">
                      {link.created}
                    </td>
                    <td className="py-4 px-4">
                      <div className="relative group">
                        <Button variant="gradient" size="sm" className="gap-2">
                          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        </Button>
                        <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                          <div className="py-2">
                            <button
                              onClick={() =>
                                router.push(
                                  `/payments/payment-link?link=${link.id}`
                                )
                              }
                              className="w-full px-4 py-2 text-left hover:bg-muted/50 text-sm flex items-center gap-2"
                            >
                              <Eye size={14} />
                              View
                            </button>
                            <button className="w-full px-4 py-2 text-left hover:bg-muted/50 text-sm flex items-center gap-2">
                              <Edit size={14} />
                              Edit
                            </button>
                            <button className="w-full px-4 py-2 text-left hover:bg-muted/50 text-sm flex items-center gap-2 text-red-600">
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TransactionsContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");

  const transactions = [
    {
      id: 1,
      description: "Payment for Custom Art Commission",
      from: "john.doe@example.com",
      amount: "$100.00",
      type: "Credit",
      status: "Completed",
      date: "Nov 27, 2025, 1:00 PM",
    },
    {
      id: 2,
      description: "Monthly subscription fee",
      from: "premium@example.com",
      amount: "$25.00",
      type: "Credit",
      status: "Completed",
      date: "Nov 25, 2025, 10:30 AM",
    },
    {
      id: 3,
      description: "Service fee",
      from: "Platform Fee",
      amount: "-$5.00",
      type: "Debit",
      status: "Completed",
      date: "Nov 25, 2025, 10:31 AM",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="bg-gradient-to-r from-green-600/20 to-yellow-600/20 border-green-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-green-900 dark:text-green-100">
            <DollarSign size={24} />
            Transactions
          </CardTitle>
          <p className="text-green-700 dark:text-green-300">
            View and manage all your transactions
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="flex-1 gap-2 bg-green-600 hover:bg-green-700 text-white">
              <Plus size={16} />
              Create Transaction
            </Button>
            <Button variant="outline" className="flex-1 gap-2">
              <Download size={16} />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transactions</CardTitle>
            <p className="text-sm text-muted-foreground">
              View and manage all your transactions
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option>All Types</option>
              <option>Credit</option>
              <option>Debit</option>
            </select>
            <Button variant="outline" className="gap-2">
              <Download size={16} />
              Export CSV
            </Button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium">
                    Description
                  </th>
                  <th className="text-left py-3 px-4 font-medium">From</th>
                  <th className="text-left py-3 px-4 font-medium">Amount</th>
                  <th className="text-left py-3 px-4 font-medium">Type</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-border">
                    <td className="py-4 px-4">
                      <div className="font-medium">
                        {transaction.description}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">
                      {transaction.from}
                    </td>
                    <td className="py-4 px-4 font-medium">
                      <span
                        className={
                          transaction.amount.startsWith("-")
                            ? "text-red-600"
                            : "text-green-600"
                        }
                      >
                        {transaction.amount}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          transaction.type === "Credit"
                            ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                            : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                        }`}
                      >
                        {transaction.type}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                        {transaction.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">
                      {transaction.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PayoutsContent() {
  const [showPayoutModal, setShowPayoutModal] = useState(false);

  const payouts = [
    {
      id: 1,
      amount: "$500.00",
      method: "Bank Transfer",
      status: "Completed",
      requested: "Nov 25, 2025",
      completed: "Nov 26, 2025",
    },
    {
      id: 2,
      amount: "$300.00",
      method: "PayPal",
      status: "Processing",
      requested: "Nov 20, 2025",
      completed: "-",
    },
    {
      id: 3,
      amount: "$200.00",
      method: "Bank Transfer",
      status: "Failed",
      requested: "Nov 15, 2025",
      completed: "Nov 16, 2025",
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Payments Dashboard */}
      <Card className="bg-gradient-to-r from-red-600/20 to-yellow-600/20 border-red-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-red-900 dark:text-red-100">
            <DollarSign size={24} />
            Payments Dashboard
          </CardTitle>
          <p className="text-red-700 dark:text-red-300">
            Overview of your payment performance and earnings
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">
                Total Earnings
              </div>
              <div className="text-2xl font-bold">$2,400.00</div>
              <div className="text-xs text-green-600 mt-1">
                +12.5% this month
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">
                Available Balance
              </div>
              <div className="text-2xl font-bold">$1,700.00</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">
                Monthly Earnings
              </div>
              <div className="text-2xl font-bold">$400.00</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">
                Pending Payouts
              </div>
              <div className="text-2xl font-bold">$300.00</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-2">
                Payment Links
              </div>
              <div className="text-xl font-bold">3 Active</div>
              <div className="text-xs text-muted-foreground mt-1">
                Generate more payment links to increase earnings
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-2">
                Recent Activity
              </div>
              <div className="text-sm">
                + $100.00 from Custom Art Commission
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                2 hours ago
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hero Section */}
      <Card className="bg-gradient-to-r from-red-600/20 to-yellow-600/20 border-red-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-red-900 dark:text-red-100">
            <Users size={24} />
            Payouts
          </CardTitle>
          <p className="text-red-700 dark:text-red-300">
            Manage your payouts and withdrawal history
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">
                Available Balance
              </div>
              <div className="text-2xl font-bold">$1,700.00</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">
                Monthly Earnings
              </div>
              <div className="text-2xl font-bold">$400.00</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">
                Pending Payouts
              </div>
              <div className="text-2xl font-bold">$300.00</div>
            </div>
          </div>
          <Button
            className="w-full gap-2 bg-red-600 hover:bg-red-700 text-white"
            onClick={() => setShowPayoutModal(true)}
          >
            <Users size={16} />
            Withdraw Now
          </Button>
        </CardContent>
      </Card>

      {/* Payout History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Payout History</CardTitle>
            <p className="text-sm text-muted-foreground">
              View and manage your payout history
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium">Amount</th>
                  <th className="text-left py-3 px-4 font-medium">Method</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Requested</th>
                  <th className="text-left py-3 px-4 font-medium">Completed</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((payout) => (
                  <tr key={payout.id} className="border-b border-border">
                    <td className="py-4 px-4 font-medium">{payout.amount}</td>
                    <td className="py-4 px-4">{payout.method}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          payout.status === "Completed"
                            ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                            : payout.status === "Processing"
                            ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                            : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                        }`}
                      >
                        {payout.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">
                      {payout.requested}
                    </td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">
                      {payout.completed}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Withdraw Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Request Payout</CardTitle>
              <p className="text-sm text-muted-foreground">
                Enter the amount you want to withdraw
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Amount
                </label>
                <Input
                  type="number"
                  placeholder="0.00"
                  className="text-2xl font-bold"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Available: $1,700.00
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Method
                </label>
                <select className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>Bank Transfer</option>
                  <option>PayPal</option>
                  <option>Mobile Money</option>
                </select>
              </div>
              <div className="flex gap-3">
                <Button
                  className="flex-1"
                  onClick={() => setShowPayoutModal(false)}
                >
                  Request Payout
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowPayoutModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
