"use client";

import { useState } from "react";
import {
  X,
  Upload,
  Video,
  File,
  FileVideo,
  Image as ImageIcon,
} from "lucide-react";

export interface VideoFormData {
  videoName: string;
  videoDescription: string;
  releaseYear: string;
  thumbnailImage?: File;
  language: string;
  abuseFlag: boolean;
  moderationAction: boolean;
  trailerFile?: File;
  mainVideoFile: File;
  paymentType: "per_view" | "free";
  currency: "USD" | "ZIG";
  price: number;
  channelId?: string;
}

interface UploadVideoFormProps {
  onClose: () => void;
  onCreate: (data: VideoFormData) => void;
}

export function UploadVideoForm({ onClose, onCreate }: UploadVideoFormProps) {
  const [formData, setFormData] = useState<VideoFormData>({
    videoName: "",
    videoDescription: "",
    releaseYear: new Date().getFullYear().toString(),
    language: "en",
    abuseFlag: false,
    moderationAction: false,
    paymentType: "free",
    currency: "USD",
    price: 0,
    mainVideoFile: {} as File,
    channelId: "",
  });
  const [errors, setErrors] = useState<{
    videoName: string;
    videoDescription: string;
    releaseYear: string;
    language: string;
    mainVideoFile: string;
    price: string;
    channelId: string;
  }>({
    videoName: "",
    videoDescription: "",
    releaseYear: "",
    language: "",
    mainVideoFile: "",
    price: "",
    channelId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [trailerPreview, setTrailerPreview] = useState<string>("");
  const [mainVideoPreview, setMainVideoPreview] = useState<string>("");

  const validateForm = () => {
    const newErrors = {
      videoName: "",
      videoDescription: "",
      releaseYear: "",
      language: "",
      mainVideoFile: "",
      price: "",
      channelId: "",
    };
    let isValid = true;

    // Video name validation
    if (!formData.videoName.trim()) {
      newErrors.videoName = "Video name is required";
      isValid = false;
    } else if (formData.videoName.length < 3) {
      newErrors.videoName = "Video name must be at least 3 characters";
      isValid = false;
    } else if (formData.videoName.length > 100) {
      newErrors.videoName = "Video name cannot exceed 100 characters";
      isValid = false;
    }

    // Video description validation
    if (formData.videoDescription.length > 1000) {
      newErrors.videoDescription = "Description cannot exceed 1000 characters";
      isValid = false;
    }

    // Release year validation
    const currentYear = new Date().getFullYear();
    const year = parseInt(formData.releaseYear);
    if (
      !formData.releaseYear ||
      isNaN(year) ||
      year < 1900 ||
      year > currentYear + 1
    ) {
      newErrors.releaseYear = "Please enter a valid release year";
      isValid = false;
    }

    // Channel validation
    if (!formData.channelId) {
      newErrors.channelId = "Please select a channel";
      isValid = false;
    }

    // Language validation
    const validLanguages = ["en", "es", "fr", "de", "pt", "zh", "ja", "ko"];
    if (!formData.language || !validLanguages.includes(formData.language)) {
      newErrors.language = "Please select a valid language";
      isValid = false;
    }

    // Main video file validation
    if (!formData.mainVideoFile || formData.mainVideoFile.size === 0) {
      newErrors.mainVideoFile = "Main video file is required";
      isValid = false;
    }

    // Price validation (only required for per_view payment type)
    if (formData.paymentType === "per_view") {
      if (!formData.price || formData.price <= 0) {
        newErrors.price = "Price must be greater than 0 for per_view videos";
        isValid = false;
      }
    } else {
      // For free videos, set price to 0
      formData.price = 0;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "thumbnailImage" | "trailerFile" | "mainVideoFile"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (field === "thumbnailImage" && !file.type.startsWith("image/")) {
        alert("Please select an image file for thumbnail");
        return;
      }

      if (
        (field === "trailerFile" || field === "mainVideoFile") &&
        !file.type.startsWith("video/")
      ) {
        alert("Please select a video file");
        return;
      }

      // Validate file size (max 2GB for videos, 10MB for images)
      const maxSize =
        field === "thumbnailImage" ? 10 * 1024 * 1024 : 2 * 1024 * 1024 * 1024;
      if (file.size > maxSize) {
        alert(
          `File size must be less than ${
            field === "thumbnailImage" ? "10MB" : "2GB"
          }`
        );
        return;
      }

      // Set file and preview
      setFormData((prev) => ({ ...prev, [field]: file }));

      if (field === "thumbnailImage" && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => setThumbnailPreview(e.target?.result as string);
        reader.readAsDataURL(file);
      }

      if (field === "trailerFile" && file.type.startsWith("video/")) {
        const reader = new FileReader();
        reader.onload = (e) => setTrailerPreview(e.target?.result as string);
        reader.readAsDataURL(file);
      }

      if (field === "mainVideoFile" && file.type.startsWith("video/")) {
        const reader = new FileReader();
        reader.onload = (e) => setMainVideoPreview(e.target?.result as string);
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate video processing and upload
      await new Promise((resolve) => setTimeout(resolve, 2000));

      onCreate(formData);
    } catch (error) {
      console.error("Failed to upload video:", error);
      setErrors((prev) => ({
        ...prev,
        videoName: "Failed to upload video. Please try again.",
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
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: checked !== undefined ? checked : value,
    }));

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
      <div className="bg-[#151515] border border-gray-800 rounded-2xl p-6 w-full max-w-4xl animate-scale-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-yellow-600 rounded-xl flex items-center justify-center">
              <Upload className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold">Upload Video</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2 font-medium">
                Video Name *
              </label>
              <input
                type="text"
                name="videoName"
                value={formData.videoName}
                onChange={handleChange}
                placeholder="Enter video name (3-100 characters)"
                className={`w-full px-4 py-3 bg-[#0f0f0f] border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-colors ${
                  errors.videoName
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-700 focus:border-red-500"
                }`}
                maxLength={100}
              />
              {errors.videoName && (
                <p className="text-red-400 text-sm mt-1">{errors.videoName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2 font-medium">
                Release Year *
              </label>
              <input
                type="number"
                name="releaseYear"
                value={formData.releaseYear}
                onChange={handleChange}
                placeholder="2024"
                min="1900"
                max={new Date().getFullYear() + 1}
                className={`w-full px-4 py-3 bg-[#0f0f0f] border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-colors ${
                  errors.releaseYear
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-700 focus:border-red-500"
                }`}
              />
              {errors.releaseYear && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.releaseYear}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2 font-medium">
              Video Description (Optional)
            </label>
            <textarea
              name="videoDescription"
              value={formData.videoDescription}
              onChange={handleChange}
              placeholder="Describe your video (max 1000 characters)"
              rows={3}
              className={`w-full px-4 py-3 bg-[#0f0f0f] border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-colors resize-none ${
                errors.videoDescription
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-700 focus:border-red-500"
              }`}
              maxLength={1000}
            />
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-gray-500">
                {formData.videoDescription.length}/1000 characters
              </span>
              {errors.videoDescription && (
                <p className="text-red-400 text-sm">
                  {errors.videoDescription}
                </p>
              )}
            </div>
          </div>

          {/* Language and Payment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2 font-medium">
                Channel *
              </label>
              <select
                name="channelId"
                value={formData.channelId}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-[#0f0f0f] border rounded-xl text-white focus:outline-none transition-colors ${
                  errors.channelId
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-700 focus:border-red-500"
                }`}
              >
                <option value="">Select channel</option>
                <option value="1">Tech Tutorials</option>
                <option value="2">Code Academy</option>
              </select>
              {errors.channelId && (
                <p className="text-red-400 text-sm mt-1">{errors.channelId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2 font-medium">
                Language *
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-[#0f0f0f] border rounded-xl text-white focus:outline-none transition-colors ${
                  errors.language
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-700 focus:border-red-500"
                }`}
              >
                <option value="">Select language</option>
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="pt">Portuguese</option>
                <option value="zh">Chinese</option>
                <option value="ja">Japanese</option>
                <option value="ko">Korean</option>
              </select>
              {errors.language && (
                <p className="text-red-400 text-sm mt-1">{errors.language}</p>
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
                className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-500 transition-colors"
              >
                <option value="free">Free</option>
                <option value="per_view">Pay Per View</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2 font-medium">
                Currency *
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-500 transition-colors"
              >
                <option value="USD">USD</option>
                <option value="ZIG">ZIG</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2 font-medium">
                Price{" "}
                {formData.paymentType === "per_view"
                  ? "(Required)"
                  : "(Optional)"}
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

          {/* File Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Thumbnail Upload */}
            <div>
              <label className="block text-sm text-gray-400 mb-2 font-medium">
                Thumbnail Image (Optional)
              </label>
              <div className="space-y-3">
                <div className="border-2 border-dashed border-gray-600 rounded-xl p-4 text-center hover:border-red-500 transition-colors">
                  <input
                    type="file"
                    id="thumbnail-upload"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "thumbnailImage")}
                    className="hidden"
                  />
                  <label htmlFor="thumbnail-upload" className="cursor-pointer">
                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-2">
                      <ImageIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <span className="text-white font-medium">
                      Upload Thumbnail
                    </span>
                    <p className="text-xs text-gray-400 mt-1">Max 10MB</p>
                  </label>
                </div>
                {thumbnailPreview && (
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="w-full h-20 object-cover rounded-lg border border-gray-600"
                  />
                )}
              </div>
            </div>

            {/* Trailer Upload */}
            <div>
              <label className="block text-sm text-gray-400 mb-2 font-medium">
                Trailer File (Optional)
              </label>
              <div className="space-y-3">
                <div className="border-2 border-dashed border-gray-600 rounded-xl p-4 text-center hover:border-red-500 transition-colors">
                  <input
                    type="file"
                    id="trailer-upload"
                    accept="video/*"
                    onChange={(e) => handleFileUpload(e, "trailerFile")}
                    className="hidden"
                  />
                  <label htmlFor="trailer-upload" className="cursor-pointer">
                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-2">
                      <FileVideo className="w-5 h-5 text-gray-400" />
                    </div>
                    <span className="text-white font-medium">
                      Upload Trailer
                    </span>
                    <p className="text-xs text-gray-400 mt-1">Max 2GB</p>
                  </label>
                </div>
                {trailerPreview && (
                  <div className="text-xs text-gray-400 text-center">
                    Video file selected
                  </div>
                )}
              </div>
            </div>

            {/* Main Video Upload */}
            <div>
              <label className="block text-sm text-gray-400 mb-2 font-medium">
                Main Video File *
              </label>
              <div className="space-y-3">
                <div
                  className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors ${
                    errors.mainVideoFile
                      ? "border-red-500"
                      : "border-gray-600 hover:border-red-500"
                  }`}
                >
                  <input
                    type="file"
                    id="main-video-upload"
                    accept="video/*"
                    onChange={(e) => handleFileUpload(e, "mainVideoFile")}
                    className="hidden"
                  />
                  <label htmlFor="main-video-upload" className="cursor-pointer">
                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Video className="w-5 h-5 text-gray-400" />
                    </div>
                    <span className="text-white font-medium">Upload Video</span>
                    <p className="text-xs text-gray-400 mt-1">Max 2GB</p>
                  </label>
                </div>
                {mainVideoPreview && (
                  <div className="text-xs text-gray-400 text-center">
                    Video file selected
                  </div>
                )}
                {errors.mainVideoFile && (
                  <p className="text-red-400 text-sm">{errors.mainVideoFile}</p>
                )}
              </div>
            </div>
          </div>

          {/* Moderation Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-3 text-sm text-gray-400 mb-2">
                <input
                  type="checkbox"
                  name="abuseFlag"
                  checked={formData.abuseFlag}
                  onChange={handleChange}
                  className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-600"
                />
                <span>Mark as potentially abusive content</span>
              </label>
            </div>

            <div>
              <label className="flex items-center gap-3 text-sm text-gray-400 mb-2">
                <input
                  type="checkbox"
                  name="moderationAction"
                  checked={formData.moderationAction}
                  onChange={handleChange}
                  className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-600"
                />
                <span>Require moderation approval</span>
              </label>
            </div>
          </div>

          {/* Submit Section */}
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
                  <span>Uploading...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Upload className="w-4 h-4" />
                  <span>Upload Video</span>
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
