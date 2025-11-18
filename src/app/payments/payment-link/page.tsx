"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { PaymentLinkFormModal } from "@/components/forms/PaymentLinkForm";
import { PaymentLinksList } from "@/components/tables/PaymentLinksList";
import { Button } from "@/components/ui/Button";
import { APIService } from "@/services/api";
import { Plus } from "lucide-react";
import { PaymentLink } from "@/types";

export default function PaymentLinkPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Load current user and payment links
  useEffect(() => {
    const loadData = async () => {
      try {
        // Get current user
        const user = await APIService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
          
          // Get payment links for this user
          const links = await APIService.getPaymentLinks(user.id);
          setPaymentLinks(links);
        }
      } catch (error) {
        console.error("Failed to load payment links:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Callback to refresh payment links after creating a new one
  const handlePaymentLinkCreated = async () => {
    if (currentUser) {
      try {
        const links = await APIService.getPaymentLinks(currentUser.id);
        setPaymentLinks(links);
      } catch (error) {
        console.error("Failed to refresh payment links:", error);
      }
    }
  };

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

        <PaymentLinksList
          paymentLinks={paymentLinks}
          isLoading={isLoading}
        />

        <PaymentLinkFormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            handlePaymentLinkCreated();
          }}
        />
      </div>
    </DashboardLayout>
  );
}
