"use client";

import { useState } from "react";
import { X, Plus, Image as ImageIcon, Upload } from "lucide-react";

export interface ChannelFormData {
  name: string;
  description: string;
  coverImage?: string;
  paymentType: "subscription_pm" | "subscription_pa" | "per_view" | "free";
  currency: "USD";
  price: number;
  status: "private" | "public";
}

interface CreateChannelFormProps {
  onClose: () => void;
  onCreate: (data: ChannelFormData) => void;
}

export function CreateChannelForm({
  onClose,
  onCreate,
}: CreateChannelFormProps) {
  const [formData, setFormData] = useState<ChannelFormData>({
    name: "",
    description: "",
    coverImage: "",
    paymentType: "free",
    currency: "USD",
    price: 0,
    status: "public",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    paymentType: "",
    price: "",
    status: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {
      name: "",
      description: "",
      paymentType: "",
      price: "",
      status: "",
    };
    let isValid = true;

    // Channel name validation
    if (!formData.name.trim()) {
      newErrors.name = "Channel name is required";
      isValid = false;
    } else if (formData.name.length < 3) {
      newErrors.name = "Channel name must be at least 3 characters";
      isValid = false;
    } else if (formData.name.length > 50) {
      newErrors.name = "Channel name cannot exceed 50 characters";
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

    // Currency is always USD (fixed)
    // No validation needed as it's pre-set

    // Price validation (only required for non-free payment types)
    if (formData.paymentType && formData.paymentType !== "free") {
      if (!formData.price || formData.price <= 0) {
        newErrors.price = "Price must be greater than 0 for paid channels";
        isValid = false;
      }
    } else {
      // For free channels, set price to 0
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
      // Prepare form data with image
      const finalFormData = { ...formData, currency: "USD" as const };
      
      // If image is selected, we would typically upload it to a server
      // For now, we'll use the preview URL or keep it empty
      if (selectedImage) {
        // In a real implementation, you would upload the image here
        // and set the coverImage to the returned URL
        // For now, we'll use the preview URL
        finalFormData.coverImage = imagePreview;
      }

      onCreate(finalFormData);
    } catch (error) {
      console.error("Failed to create channel:", error);
      setErrors((prev) => ({
        ...prev,
        name: "Failed to create channel. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file (JPEG, PNG, GIF, etc.)");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image file size must be less than 5MB");
        return;
      }

      setSelectedImage(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold">Create Channel</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-2 font-medium">
              Channel Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter channel name (3-50 characters)"
              className={`w-full px-4 py-3 bg-[#0f0f0f] border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-colors ${
                errors.name
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-700 focus:border-red-500"
              }`}
              maxLength={50}
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
                Currency
              </label>
              <div className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-700 rounded-xl text-white">
                USD (Fixed)
              </div>
            </div>

            <div>
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div>
              <label className="block text-sm text-gray-400 mb-2 font-medium">
                Currency
              </label>
              <div className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-700 rounded-xl text-white">
                USD (Fixed)
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2 font-medium">
              Cover Image (Optional)
            </label>
            <div className="space-y-3">
              {/* Image Upload Area */}
              <div className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center hover:border-red-500 transition-colors">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center gap-3 cursor-pointer group"
                >
                  <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center group-hover:bg-red-600 transition-colors">
                    <Upload className="w-6 h-6 text-gray-400 group-hover:text-white" />
                  </div>
                  <div>
                    <span className="text-white font-medium">Upload Image</span>
                    <p className="text-gray-400 text-sm">Click to browse your device</p>
                  </div>
                  <p className="text-xs text-gray-500">Max 5MB • JPG, PNG, GIF</p>
                </label>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Cover preview"
                    className="w-full h-32 object-cover rounded-xl border border-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview("");
                    }}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2 font-medium">
              Channel Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your channel (max 500 characters)"
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
              className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale border border-red-500/30 hover:border-red-500/50"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />
                  <span>Create Channel</span>
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
