"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

export const PaymentRequestForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({
    recipientEmail: "",
    amount: "",
    reason: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.recipientEmail)
      newErrors.recipientEmail = "Email is required";
    if (!formData.amount) newErrors.amount = "Amount is required";
    if (!formData.reason) newErrors.reason = "Reason is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSent(true);
      setFormData({ recipientEmail: "", amount: "", reason: "" });
      setTimeout(() => setSent(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Payment</CardTitle>
        <CardDescription>
          Request payment from a brand, client, or follower
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {sent && (
          <div className="bg-green-100 border border-green-300 rounded-lg p-4 text-sm text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-400">
            Payment request sent successfully! ✓
          </div>
        )}

        <Input
          label="Recipient Email or Username"
          name="recipientEmail"
          value={formData.recipientEmail}
          onChange={handleChange}
          placeholder="Enter email or username"
          error={errors.recipientEmail}
        />

        <Input
          label="Amount"
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          placeholder="0.00"
          min="0"
          step="0.01"
          error={errors.amount}
        />

        <Textarea
          label="Reason"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          placeholder="Why are you requesting this payment? e.g., 'Sponsorship collaboration', 'Content creation fee'"
          error={errors.reason}
          rows={4}
        />

        <Button onClick={handleSubmit} isLoading={isLoading} className="w-full">
          Send Payment Request
        </Button>
      </CardContent>
    </Card>
  );
};
