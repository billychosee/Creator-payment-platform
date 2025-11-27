export interface User {
  id: string;
  username: string;
  email: string;
  tagline?: string;
  bio?: string;
  profileImage?: string;
  socialLinks?: SocialLinks;
  createdAt: Date;
}

export interface SocialLinks {
  twitter?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  twitch?: string;
  linkedin?: string;
  primary?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: "donation" | "payment_link" | "payment_request";
  status: "completed" | "pending" | "failed";
  description?: string;
  createdAt: Date;
  fromUser?: {
    username: string;
    profileImage?: string;
  };
}

export interface Payout {
  id: string;
  userId: string;
  amount: number;
  status: "pending" | "processing" | "completed" | "failed";
  method: "bank_transfer" | "paypal" | "stripe";
  createdAt: Date;
  completedAt?: Date;
}

export interface PaymentLink {
  id: string;
  userId: string;
  name: string;
  currency: string;
  reference: string;
  description: string;
  shareUrl: string;
  logo?: string;
  customerRedirectUrl?: string;
  customerFailRedirectUrl?: string;
  startDate?: Date;
  expiryDate?: Date;
  createdAt: Date;
  status: "active" | "inactive" | "expired";
}

export interface PaymentRequest {
  id: string;
  userId: string;
  recipientEmail: string;
  amount: number;
  reason: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
}

export interface DashboardStats {
  totalEarnings: number;
  todayEarnings: number;
  pendingPayouts: number;
  totalTransactions: number;
}

