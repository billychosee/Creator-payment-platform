"use client";

import { PaymentLink } from "@/types";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { QRCodeGenerator } from "@/components/ui/QRCodeGenerator";
import { formatDateWithTime } from "@/lib/utils";
import { ExternalLink, Copy, QrCode, Calendar, Tag, DollarSign, Link2, Copy as CopyIcon } from "lucide-react";

interface PaymentLinkViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentLink: PaymentLink | null;
}

export const PaymentLinkViewModal = ({
  isOpen,
  onClose,
  paymentLink,
}: PaymentLinkViewModalProps) => {
  if (!paymentLink) return null;

  // Debug logging
  console.log("PaymentLinkViewModal - paymentLink:", paymentLink);
  console.log("PaymentLinkViewModal - shareUrl:", paymentLink?.shareUrl);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
      console.log(`${label} copied to clipboard`);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const statusColors = {
    active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    inactive: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    expired: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  // Use a fallback URL if shareUrl is invalid
  const qrCodeUrl = paymentLink.shareUrl || `https://creatorpay.com/pay/${paymentLink.reference}`;
  
  const openShareUrl = () => {
    window.open(paymentLink.shareUrl, '_blank');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Payment Link Details"
      size="lg"
      position="center"
    >
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-start gap-4">
          {paymentLink.logo && (
            <img
              src={paymentLink.logo}
              alt="Logo"
              className="w-16 h-16 rounded-lg object-cover border border-border"
            />
          )}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-semibold text-foreground">
                {paymentLink.name}
              </h3>
              <span
                className={`text-xs px-2 py-1 rounded font-medium ${statusColors[paymentLink.status]}`}
              >
                {paymentLink.status.charAt(0).toUpperCase() + paymentLink.status.slice(1)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {paymentLink.description || "No description provided"}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
                {paymentLink.currency}
              </span>
              <span className="text-xs text-muted-foreground">
                Reference: {paymentLink.reference}
              </span>
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="bg-muted/50 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <QrCode className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              QR Code for Payment Link
            </span>
          </div>
          <div className="flex justify-center">
            <QRCodeGenerator
              value={qrCodeUrl}
              size={128}
              className="mx-auto"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Scan this QR code to access the payment link
          </p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Share URL */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Link2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Share URL</span>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 p-3 bg-muted rounded-lg border">
                <p className="text-sm font-mono break-all">
                  {paymentLink.shareUrl}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(paymentLink.shareUrl, "Share URL")}
                className="px-3"
              >
                <CopyIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Reference */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Reference</span>
            </div>
            <div className="p-3 bg-muted rounded-lg border">
              <p className="text-sm font-mono">
                {paymentLink.reference}
              </p>
            </div>
          </div>

          {/* Currency */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Currency</span>
            </div>
            <div className="p-3 bg-muted rounded-lg border">
              <p className="text-sm font-semibold text-primary">
                {paymentLink.currency}
              </p>
            </div>
          </div>

          {/* Created Date */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Created</span>
            </div>
            <div className="p-3 bg-muted rounded-lg border">
              <p className="text-sm">
                {formatDateWithTime(paymentLink.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        {(paymentLink.startDate || paymentLink.expiryDate || paymentLink.customerRedirectUrl) && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Additional Information</h4>
            
            {paymentLink.startDate && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground">Start Date</span>
                  <p className="text-sm">{formatDateWithTime(paymentLink.startDate)}</p>
                </div>
                {paymentLink.expiryDate && (
                  <div>
                    <span className="text-xs text-muted-foreground">Expiry Date</span>
                    <p className="text-sm">{formatDateWithTime(paymentLink.expiryDate)}</p>
                  </div>
                )}
              </div>
            )}

            {paymentLink.customerRedirectUrl && (
              <div>
                <span className="text-xs text-muted-foreground">Customer Redirect URL</span>
                <p className="text-sm break-all">{paymentLink.customerRedirectUrl}</p>
              </div>
            )}

            {paymentLink.customerFailRedirectUrl && (
              <div>
                <span className="text-xs text-muted-foreground">Customer Fail Redirect URL</span>
                <p className="text-sm break-all">{paymentLink.customerFailRedirectUrl}</p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Close
          </Button>
          <Button
            onClick={openShareUrl}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open Payment Link
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentLinkViewModal;