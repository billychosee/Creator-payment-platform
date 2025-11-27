"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Copy, QrCode, Check, ExternalLink, Download } from "lucide-react";
import QRCode from "qrcode";

interface PaymentLinkSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentLinkData: {
    paymentLinkName: string;
    reference: string;
    paymentCurrency: string;
  };
  userData?: {
    name?: string;
    email?: string;
    address?: string;
    telephone?: string;
  };
}

export const PaymentLinkSuccessModal = ({ 
  isOpen, 
  onClose, 
  paymentLinkData,
  userData
}: PaymentLinkSuccessModalProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  
  // Generate a mock payment link URL
  const paymentLinkUrl = `https://creatorpay.com/pay/${paymentLinkData.reference}`;
  
  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const qrDataUrl = await QRCode.toDataURL(paymentLinkUrl, {
          width: 256,
          margin: 2,
          color: {
            dark: '#1f2937', // Dark gray for the QR code
            light: '#ffffff' // White background
          }
        });
        setQrCodeUrl(qrDataUrl);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };
    
    if (isOpen) {
      generateQRCode();
    }
  }, [isOpen, paymentLinkUrl]);
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(paymentLinkUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };
  
  const handleDownloadQR = () => {
    if (qrCodeUrl) {
      // Create a temporary link element to trigger download
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `${paymentLinkData.paymentLinkName.replace(/\s+/g, '-')}-qr-code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  const handleClose = () => {
    setCopied(false);
    onClose();
  };
  
  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };
  
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      title="Payment Link Created Successfully!"
      size="md"
      position="center"
    >
      <div className="space-y-6">
        {/* Success Icon and Message */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {paymentLinkData.paymentLinkName}
            </h3>
            <p className="text-sm text-muted-foreground">
              Your payment link has been created and is ready to use
            </p>
          </div>
        </div>
        
        {/* User Information */}
        {userData && (
          <div className="bg-secondary/20 rounded-lg p-4 space-y-2">
            <h4 className="text-sm font-semibold text-foreground mb-3">Payment Details</h4>
            {userData.name && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium text-foreground">{userData.name}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Date:</span>
              <span className="font-medium text-foreground">{getTodayDate()}</span>
            </div>
            {userData.email && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium text-foreground">{userData.email}</span>
              </div>
            )}
            {userData.address && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Address:</span>
                <span className="font-medium text-foreground text-right">{userData.address}</span>
              </div>
            )}
            {userData.telephone && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Telephone:</span>
                <span className="font-medium text-foreground">{userData.telephone}</span>
              </div>
            )}
          </div>
        )}
        
        {/* Payment Link */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">
            Payment Link
          </label>
          <div className="flex items-center gap-2 p-3 border border-border rounded-lg bg-background">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-mono text-foreground break-all">
                {paymentLinkUrl}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>
        
        {/* QR Code */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-foreground">
              QR Code
            </label>
            {qrCodeUrl && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDownloadQR}
                className="text-primary border-primary hover:bg-primary hover:text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            )}
          </div>
          <div className="flex justify-center">
            <div className="p-4 border border-border rounded-lg bg-background">
              {qrCodeUrl ? (
                <img 
                  src={qrCodeUrl} 
                  alt="Payment Link QR Code" 
                  className="w-48 h-48 cursor-pointer"
                  onClick={handleDownloadQR}
                  title="Click to download QR code"
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>
          <p className="text-xs text-center text-muted-foreground">
            Scan this QR code to access your payment link
          </p>
        </div>
        
        {/* Currency Info */}
        <div className="bg-secondary/20 rounded-lg p-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Currency:</span>
            <span className="font-medium text-foreground">{paymentLinkData.paymentCurrency}</span>
          </div>
          <div className="flex justify-between items-center text-sm mt-1">
            <span className="text-muted-foreground">Reference:</span>
            <span className="font-mono text-foreground">{paymentLinkData.reference}</span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="flex-1"
          >
            Close
          </Button>
          <Button
            type="button"
            onClick={() => window.open(paymentLinkUrl, '_blank')}
            className="flex-1 bg-primary hover:bg-primary/90 zim-red-accent"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Link
          </Button>
        </div>
      </div>
    </Modal>
  );
};
