"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { PaymentLinkSuccessModal } from "@/components/ui/PaymentLinkSuccessModal";
import { DatePicker } from "@/components/ui/DatePicker";
import { APIService } from "@/services/api";
import { Upload, Save, X } from "lucide-react";

interface PaymentLinkFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentLinkFormModal = ({
  isOpen,
  onClose,
}: PaymentLinkFormModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdPaymentLink, setCreatedPaymentLink] = useState<{
    paymentLinkName: string;
    reference: string;
    paymentCurrency: string;
  } | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Helper function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Get current user data when component mounts
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const user = await APIService.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Failed to load current user:", error);
      }
    };

    loadCurrentUser();
  }, []);

  const [formData, setFormData] = useState({
    paymentLinkName: "",
    paymentCurrency: "USD",
    reference: "",
    startDate: getTodayDate(), // Auto-populate with today's date
    expiryDate: "",
    description: "",
    logo: null as File | null,
    customerRedirectUrl: "",
    customerFailRedirectUrl: "",
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.paymentLinkName.trim()) {
      newErrors.paymentLinkName = "Payment Link Name is required";
    }

    if (!formData.reference.trim()) {
      newErrors.reference = "Payment Link Reference is required";
    }

    if (formData.startDate && formData.expiryDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.expiryDate);
      if (start >= end) {
        newErrors.expiryDate = "Expiry date must be after start date";
      }
    }

    // URL validation
    const urlPattern = /^https?:\/\/.+/;
    if (
      formData.customerRedirectUrl &&
      !urlPattern.test(formData.customerRedirectUrl)
    ) {
      newErrors.customerRedirectUrl =
        "Please enter a valid URL starting with http:// or https://";
    }

    if (
      formData.customerFailRedirectUrl &&
      !urlPattern.test(formData.customerFailRedirectUrl)
    ) {
      newErrors.customerFailRedirectUrl =
        "Please enter a valid URL starting with http:// or https://";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          logo: "File size must be less than 5MB",
        }));
        return;
      }

      // Validate file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          logo: "Only JPG, JPEG, or PNG files are allowed",
        }));
        return;
      }
    }

    setFormData((prev) => ({ ...prev, logo: file }));
    if (errors.logo) {
      setErrors((prev) => ({ ...prev, logo: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !currentUser) {
      return;
    }

    setIsLoading(true);

    try {
      // Create payment link using API
      const newPaymentLink = await APIService.createPaymentLink({
        userId: currentUser.id,
        name: formData.paymentLinkName,
        currency: formData.paymentCurrency,
        reference: formData.reference,
        description: formData.description,
        customerRedirectUrl: formData.customerRedirectUrl || undefined,
        customerFailRedirectUrl: formData.customerFailRedirectUrl || undefined,
        startDate: formData.startDate
          ? new Date(formData.startDate)
          : undefined,
        expiryDate: formData.expiryDate
          ? new Date(formData.expiryDate)
          : undefined,
      });

      console.log("Payment Link created:", newPaymentLink);

      // Store the created payment link data for success modal
      setCreatedPaymentLink({
        paymentLinkName: formData.paymentLinkName,
        reference: formData.reference,
        paymentCurrency: formData.paymentCurrency,
      });

      // Reset form and close main modal, then show success modal
      setFormData({
        paymentLinkName: "",
        paymentCurrency: "USD",
        reference: "",
        startDate: getTodayDate(), // Auto-populate with today's date
        expiryDate: "",
        description: "",
        logo: null,
        customerRedirectUrl: "",
        customerFailRedirectUrl: "",
      });
      setErrors({});
      onClose();
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error creating payment link:", error);
      setErrors({ submit: "Failed to create payment link. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setFormData({
      paymentLinkName: "",
      paymentCurrency: "USD",
      reference: "",
      startDate: getTodayDate(), // Auto-populate with today's date
      expiryDate: "",
      description: "",
      logo: null,
      customerRedirectUrl: "",
      customerFailRedirectUrl: "",
    });
    setErrors({});
    onClose();
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setCreatedPaymentLink(null);
  };

  // Prepare user data for the success modal
  const getUserDataForModal = () => {
    if (!currentUser) return undefined;

    return {
      name: currentUser.username || currentUser.email,
      email: currentUser.email,
      address: "4056 4th street Dzivaresekwa", // Static address as per requirement
      telephone: "0788559154", // Static telephone as per requirement
    };
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Create A New Payment Link"
        size="lg"
        position="center"
        contentClassName="p-0"
      >
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {/* Payment Link Name */}
          <div>
            <Input
              label="Payment Link Name"
              name="paymentLinkName"
              value={formData.paymentLinkName}
              onChange={handleChange}
              placeholder="Payment Link Name"
              error={errors.paymentLinkName}
              required
            />
          </div>

          {/* Payment Currency & Reference */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Payment Currency
              </label>
              <Select
                value={formData.paymentCurrency}
                onValueChange={(value) => {
                  setFormData((prev) => ({ ...prev, paymentCurrency: value }));
                  if (errors.paymentCurrency) {
                    setErrors((prev) => ({ ...prev, paymentCurrency: "" }));
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="CAD">CAD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Input
              label="Reference"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              placeholder="Payment Link Reference"
              error={errors.reference}
              required
            />
          </div>

          {/* Date Fields */}
          <div className="grid grid-cols-2 gap-3">
            <DatePicker
              label="Start Date"
              value={formData.startDate}
              onChange={(date) => {
                setFormData((prev) => ({ ...prev, startDate: date }));
                if (errors.startDate) {
                  setErrors((prev) => ({ ...prev, startDate: "" }));
                }
              }}
              placeholder="mm/dd/yyyy"
              error={errors.startDate}
            />
            <DatePicker
              label="Expiry Date"
              value={formData.expiryDate}
              onChange={(date) => {
                setFormData((prev) => ({ ...prev, expiryDate: date }));
                if (errors.expiryDate) {
                  setErrors((prev) => ({ ...prev, expiryDate: "" }));
                }
              }}
              placeholder="mm/dd/yyyy"
              error={errors.expiryDate}
            />
          </div>

          {/* Description */}
          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            rows={2}
          />

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Image
            </label>
            <div className="border border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
                id="logo-upload"
              />
              <label htmlFor="logo-upload" className="cursor-pointer">
                <Upload className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-1">
                  No file chosen
                </p>
              </label>
            </div>
            <p className="text-xs text-muted-foreground">
              Please upload a clear image of your Logo. This will help us verify
              the Payment and process your payment faster. Image size should be
              less than 5MB (jpg, jpeg or png format).
            </p>
            {errors.logo && (
              <p className="text-xs text-destructive">{errors.logo}</p>
            )}
            {formData.logo && (
              <p className="text-sm font-medium text-primary">
                Selected: {formData.logo.name}
              </p>
            )}
          </div>

          {/* Redirect URLs */}
          <Input
            label="Customer Redirect Url"
            name="customerRedirectUrl"
            value={formData.customerRedirectUrl}
            onChange={handleChange}
            placeholder="Customer Redirect Url"
            error={errors.customerRedirectUrl}
            type="url"
          />
          <Input
            label="Customer Fail Redirect Url"
            name="customerFailRedirectUrl"
            value={formData.customerFailRedirectUrl}
            onChange={handleChange}
            placeholder="Customer Fail Redirect Url"
            error={errors.customerFailRedirectUrl}
            type="url"
          />

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
            >
              CLOSE
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              className="flex-1 bg-primary hover:bg-primary/90 zim-red-accent"
            >
              <Save className="w-4 h-4 mr-2" />
              SAVE
            </Button>
          </div>
        </form>
      </Modal>

      {/* Success Modal with QR Code and User Information */}
      {createdPaymentLink && (
        <PaymentLinkSuccessModal
          isOpen={showSuccessModal}
          onClose={handleSuccessModalClose}
          paymentLinkData={createdPaymentLink}
          userData={getUserDataForModal()}
        />
      )}
    </>
  );
};
