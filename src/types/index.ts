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
  totalBalance: number;
  totalPaidOut: number;
  views: number;
  watchTime: string;
  subscribers: number;
  subscriptionEarningsPerMonth: number;
  payPerView: number;
  topViewedVideos: TopViewedVideo[];
  totalEarnings: number;
  todayEarnings: number;
  pendingPayouts: number;
  totalTransactions: number;
}

export interface Channel {
  id: string;
  name: string;
  description?: string;
  profileImage?: string;
  subscribers: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  channelId: string;
  channelName: string;
  videoCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Video {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  duration: string;
  views: number;
  uniqueViews: number;
  newUniqueViews: number;
  watchTime: string;
  playlistId?: string;
  playlistName?: string;
  channelId: string;
  channelName: string;
  status: "active" | "abuseReported" | "blocked";
  createdAt: Date;
  updatedAt: Date;
  comments?: Comment[];
  likes?: VideoLike[];
}

export interface TopViewedVideo {
  playlistName: any;
  channelName: any;
  status: any;
  createdAt: any;
  id: string;
  name: string;
  views: number;
}

export interface Payment {
  id: string;
  userId: string;
  date: Date;
  description: string;
  currency: string;
  amount: number;
  paymentMethod: string;
  provider: string;
  status: "completed" | "pending" | "failed";
  createdAt: Date;
}

export interface AbuseReport {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  moderation: string;
  resolutionNotes?: string;
  reportStatus: "pending" | "in_progress" | "resolved" | "rejected";
  createdAt: Date;
  resolvedAt?: Date;
}

export interface SubscriptionEarnings {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  period: string;
  createdAt: Date;
}

export interface PayPerView {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  videoId: string;
  videoTitle: string;
  viewerId: string;
  viewerName: string;
  createdAt: Date;
}

export interface Comment {
  id: string;
  videoId: string;
  userId: string;
  username: string;
  profileImage?: string;
  content: string;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
  replies?: Comment[];
}

export interface VideoLike {
  id: string;
  videoId: string;
  userId: string;
  createdAt: Date;
}
