"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";

export interface PlaylistFormData {
  name: string;
  description: string;
  channelId: string;
  paymentType: "subscription_pm" | "subscription_pa" | "per_view" | "free";
  currency: string;
  price: number;
  status: "private" | "public";
  thumbnail?: string;
}

interface CreatePlaylistFormProps {
  channelId: string;
  channelName: string;
  onClose: () => void;
  onCreate: (data: PlaylistFormData) => void;
}

export function CreatePlaylistForm({
  channelId,
  channelName,
  onClose,
  onCreate,
}: CreatePlaylistFormProps) {
  const [formData, setFormData] = useState<PlaylistFormData>({
    name: "",
    description: "",
    channelId: "",
    paymentType: "free",
    currency: "",
    price: 0,
    status: "public",
    thumbnail: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    paymentType: "",
    currency: "",
    price: "",
    status: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {
      name: "",
      description: "",
      paymentType: "",
      currency: "",
      price: "",
      status: "",
    };
    let isValid = true;

    // Playlist name validation
    if (!formData.name.trim()) {
      newErrors.name = "Playlist name is required";
      isValid = false;
    } else if (formData.name.length < 3) {
      newErrors.name = "Playlist name must be at least 3 characters";
      isValid = false;
    } else if (formData.name.length > 100) {
      newErrors.name = "Playlist name cannot exceed 100 characters";
      isValid = false;
    }

    // Payment type validation
    const validPaymentTypes = [
      "subscription_pm",
      "subscription_pa",
      "per_view",
      "free",
    ];
    if (
      !formData.paymentType ||
      !validPaymentTypes.includes(formData.paymentType)
    ) {
      newErrors.paymentType = "Please select a valid payment type";
      isValid = false;
    }

    // Currency validation
    if (!formData.currency) {
      newErrors.currency = "Currency is required";
      isValid = false;
    }

    // Price validation (only required for non-free payment types)
    if (formData.paymentType && formData.paymentType !== "free") {
      if (!formData.price || formData.price <= 0) {
        newErrors.price = "Price must be greater than 0 for paid playlists";
        isValid = false;
      }
    } else {
      // For free playlists, set price to 0
      formData.price = 0;
    }

    // Status validation
    const validStatuses = ["private", "public"];
    if (!formData.status || !validStatuses.includes(formData.status)) {
      newErrors.status = "Please select a valid status";
      isValid = false;
    }

    // Description length validation
    if (formData.description.length > 500) {
      newErrors.description = "Description cannot exceed 500 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      onCreate({
        ...formData,
        channelId,
      });
    } catch (error) {
      console.error("Failed to create playlist:", error);
      setErrors((prev) => ({
        ...prev,
        name: "Failed to create playlist. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-[#151515] border border-gray-800 rounded-2xl p-6 w-full max-w-xl animate-scale-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Create Playlist</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-gray-400 text-sm mb-4">
          Channel: <span className="text-white">{channelName}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-2 font-medium">
              Playlist Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter playlist name (3-100 characters)"
              className={`w-full px-4 py-3 bg-[#0f0f0f] border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-colors ${
                errors.name
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-700 focus:border-red-500"
              }`}
              maxLength={100}
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2 font-medium">
              Payment Type *
            </label>
            <select
              name="paymentType"
              value={formData.paymentType}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-[#0f0f0f] border rounded-xl text-white focus:outline-none transition-colors ${
                errors.paymentType
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-700 focus:border-red-500"
              }`}
            >
              <option value="">Select payment type</option>
              <option value="free">Free</option>
              <option value="subscription_pm">Subscription (Monthly)</option>
              <option value="subscription_pa">Subscription (Annual)</option>
              <option value="per_view">Pay Per View</option>
            </select>
            {errors.paymentType && (
              <p className="text-red-400 text-sm mt-1">{errors.paymentType}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2 font-medium">
                Currency *
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-[#0f0f0f] border rounded-xl text-white focus:outline-none transition-colors ${
                  errors.currency
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-700 focus:border-red-500"
                }`}
              >
                <option value="">Select currency</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="ZAR">ZAR</option>
              </select>
              {errors.currency && (
                <p className="text-red-400 text-sm mt-1">{errors.currency}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2 font-medium">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-[#0f0f0f] border rounded-xl text-white focus:outline-none transition-colors ${
                  errors.status
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-700 focus:border-red-500"
                }`}
              >
                <option value="">Select status</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
              {errors.status && (
                <p className="text-red-400 text-sm mt-1">{errors.status}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-2 font-medium">
                Price{" "}
                {formData.paymentType !== "free" ? "(Required)" : "(Optional)"}
              </label>
              <input
                type="number"
                name="price"
                value={formData.price || ""}
                onChange={handleChange}
                placeholder={
                  formData.paymentType === "free" ? "0" : "Enter price"
                }
                min="0"
                step="0.01"
                disabled={formData.paymentType === "free"}
                className={`w-full px-4 py-3 bg-[#0f0f0f] border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-colors ${
                  errors.price
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-700 focus:border-red-500"
                } ${
                  formData.paymentType === "free"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              />
              {errors.price && (
                <p className="text-red-400 text-sm mt-1">{errors.price}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-2 font-medium">
                Thumbnail (Optional)
              </label>
              <input
                type="url"
                name="thumbnail"
                value={formData.thumbnail || ""}
                onChange={handleChange}
                placeholder="Enter thumbnail URL"
                className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2 font-medium">
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your playlist (max 500 characters)"
              rows={4}
              className={`w-full px-4 py-3 bg-[#0f0f0f] border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-colors resize-none ${
                errors.description
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-700 focus:border-red-500"
              }`}
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-gray-500">
                {formData.description.length}/500 characters
              </span>
              {errors.description && (
                <p className="text-red-400 text-sm">{errors.description}</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-colors border border-gray-700 hover:border-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                isSubmitting ||
                Object.values(errors).some((error) => error !== "")
              }
              className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-yellow-600 text-white rounded-xl hover:from-red-700 hover:to-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale border border-red-500/30 hover:border-red-500/50"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />
                  <span>Create Playlist</span>
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
