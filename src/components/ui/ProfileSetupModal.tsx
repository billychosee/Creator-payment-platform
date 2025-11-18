"use client";

import { useState } from "react";
import { X, Save } from "lucide-react";

interface ProfileSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (profileData: any) => void;
  userEmail?: string;
}

export const ProfileSetupModal = ({ isOpen, onClose, onComplete, userEmail }: ProfileSetupModalProps) => {
  const [formData, setFormData] = useState({
    gender: '',
    dateOfBirth: '',
    email: userEmail || '',
    mobile: '',
    tradingName: '',
    telephoneNumber: '',
    province: '',
    country: 'Zimbabwe',
    businessDescription: '',
    tradingAddress: '',
    businessSector: '',
    callbackUrl: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const provinces = [
    'Harare Metropolitan',
    'Bulawayo Metropolitan',
    'Manicaland',
    'Mashonaland Central',
    'Mashonaland East',
    'Mashonaland West',
    'Masvingo',
    'Matabeleland North',
    'Matabeleland South',
    'Midlands'
  ];

  const countries = [
    'Zimbabwe',
    'South Africa',
    'Botswana',
    'Zambia',
    'Mozambique',
    'Namibia',
    'Lesotho',
    'Swaziland'
  ];

  const businessSectors = [
    'Agriculture',
    'Mining',
    'Manufacturing',
    'Construction',
    'Trade and Commerce',
    'Transport and Communications',
    'Finance and Insurance',
    'Real Estate',
    'Professional Services',
    'Education',
    'Health Services',
    'Hospitality and Tourism',
    'Information Technology',
    'Government',
    'Other'
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.gender) newErrors.gender = "Please select gender";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Please select date of birth";
    if (!formData.mobile) newErrors.mobile = "Mobile number is required";
    if (!formData.tradingName) newErrors.tradingName = "Trading name is required";
    if (!formData.province) newErrors.province = "Please select province";
    if (!formData.country) newErrors.country = "Please select country";
    if (!formData.businessDescription) newErrors.businessDescription = "Business description is required";
    if (!formData.tradingAddress) newErrors.tradingAddress = "Trading address is required";
    if (!formData.businessSector) newErrors.businessSector = "Please select business sector";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validateForm()) return;

    onComplete({
      ...formData,
      completedAt: new Date().toISOString()
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-green-600 to-yellow-500">
          <h2 className="text-2xl font-bold text-white">UPDATE YOUR PROFILE</h2>
          <div className="text-white/80 text-sm">Complete all fields to continue</div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-blue-800 dark:text-blue-300 text-sm">
              <strong>Required:</strong> Please complete all fields below to access your dashboard. This information is necessary for account verification and compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Select Gender <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Date Of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                readOnly
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Mobile <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.mobile}
                onChange={(e) => handleChange('mobile', e.target.value)}
                placeholder="+263XXXXXXXXX"
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
            </div>

            {/* Trading Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Trading Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.tradingName}
                onChange={(e) => handleChange('tradingName', e.target.value)}
                placeholder="Enter trading name"
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.tradingName && <p className="text-red-500 text-xs mt-1">{errors.tradingName}</p>}
            </div>

            {/* Telephone Number */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Telephone Number
              </label>
              <input
                type="tel"
                value={formData.telephoneNumber}
                onChange={(e) => handleChange('telephoneNumber', e.target.value)}
                placeholder="+263XXXXXXX"
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Province */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Select Province <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.province}
                onChange={(e) => handleChange('province', e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select Province</option>
                {provinces.map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
              {errors.province && <p className="text-red-500 text-xs mt-1">{errors.province}</p>}
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Select Country <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.country}
                onChange={(e) => handleChange('country', e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
              {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
            </div>

            {/* Business Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Business Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.businessDescription}
                onChange={(e) => handleChange('businessDescription', e.target.value)}
                placeholder="Describe your business activities"
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary h-24 resize-none"
              />
              {errors.businessDescription && <p className="text-red-500 text-xs mt-1">{errors.businessDescription}</p>}
            </div>

            {/* Trading Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Trading Address <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.tradingAddress}
                onChange={(e) => handleChange('tradingAddress', e.target.value)}
                placeholder="Enter your full trading address"
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary h-20 resize-none"
              />
              {errors.tradingAddress && <p className="text-red-500 text-xs mt-1">{errors.tradingAddress}</p>}
            </div>

            {/* Business Sector */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Select Individual Business Sector <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.businessSector}
                onChange={(e) => handleChange('businessSector', e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select Business Sector</option>
                {businessSectors.map(sector => (
                  <option key={sector} value={sector}>{sector}</option>
                ))}
              </select>
              {errors.businessSector && <p className="text-red-500 text-xs mt-1">{errors.businessSector}</p>}
            </div>

            {/* Callback URL */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Callback Url
              </label>
              <input
                type="url"
                value={formData.callbackUrl}
                onChange={(e) => handleChange('callbackUrl', e.target.value)}
                placeholder="https://yourwebsite.com/callback"
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-muted-foreground text-xs mt-1">Optional: URL for payment notifications</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-secondary/20">
          <div className="flex items-center justify-center">
            <button
              onClick={handleContinue}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-yellow-500 text-white rounded-lg hover:from-green-700 hover:to-yellow-600 transition-all font-semibold flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              SAVE
            </button>
          </div>
          <p className="text-center text-muted-foreground text-xs mt-2">
            You must complete all required fields to access your dashboard
          </p>
        </div>
      </div>
    </div>
  );
};