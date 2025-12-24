"use client";

import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { PaymentRequestForm } from "@/components/forms/PaymentRequestForm";

export default function PaymentRequestPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-2xl animate-fade-in px-4 sm:px-6 lg:px-8 py-8">
        <div>
          <h1 className="text-3xl font-bold">Payment Request</h1>
          <p className="text-muted-foreground mt-2">
            Request payment from a brand, client, or follower
          </p>
        </div>
        <PaymentRequestForm />
      </div>
    </DashboardLayout>
  );
}

