"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { PaymentLinkFormModal } from "@/components/forms/PaymentLinkForm";
import { PaymentLinksList } from "@/components/tables/PaymentLinksList";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { MOCK_PAYMENT_LINKS } from "@/services/mock";

export default function PaymentLinkPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Payment Link</h1>
            <p className="text-muted-foreground mt-2">
              Create and manage payment links for your services
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary/90 zim-red-accent">
            <Plus className="w-4 h-4 mr-2" />
            Create Payment Link
          </Button>
        </div>

        <PaymentLinksList paymentLinks={MOCK_PAYMENT_LINKS} />

        <PaymentLinkFormModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      </div>
    </DashboardLayout>
  );
}
