import { Transaction, Payout, DashboardStats, User, PaymentLink } from "@/types";

export const MOCK_USER: User = {
  id: "user_123",
  username: "alex_creator",
  email: "alex@example.com",
  tagline: "Digital creator | Content filmmaker",
  bio: "Creating amazing content for amazing people",
  profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
  socialLinks: {
    twitter: "@alex_creator",
    instagram: "@alexcreator",
    youtube: "AlexCreatorChannel",
    tiktok: "@alexcreator",
  },
  createdAt: new Date("2023-01-15"),
};

export const MOCK_PAYMENT_LINKS: PaymentLink[] = [
  {
    id: "pl_001",
    userId: "user_123",
    name: "Premium Coaching Session",
    currency: "USD",
    reference: "COACHING_2024_001",
    description: "One-on-one coaching session for content creators",
    shareUrl: "https://creatorpay.com/pay/premium-coaching",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=coaching",
    customerRedirectUrl: "https://example.com/thank-you",
    customerFailRedirectUrl: "https://example.com/payment-failed",
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    status: "active",
  },
  {
    id: "pl_002",
    userId: "user_123",
    name: "Digital Course Bundle",
    currency: "USD",
    reference: "COURSE_BUNDLE_001",
    description: "Complete digital marketing course for creators",
    shareUrl: "https://creatorpay.com/pay/course-bundle",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=course",
    customerRedirectUrl: "https://example.com/access-course",
    startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    status: "active",
  },
  {
    id: "pl_003",
    userId: "user_123",
    name: "Merchandise Store",
    currency: "USD",
    reference: "MERCH_001",
    description: "Custom branded merchandise and apparel",
    shareUrl: "https://creatorpay.com/pay/merch",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=merch",
    customerRedirectUrl: "https://example.com/order-confirmed",
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    status: "active",
  },
  {
    id: "pl_004",
    userId: "user_123",
    name: "VIP Membership",
    currency: "USD",
    reference: "VIP_MEMBERSHIP_001",
    description: "Monthly VIP subscription with exclusive content",
    shareUrl: "https://creatorpay.com/pay/vip",
    customerRedirectUrl: "https://example.com/welcome-vip",
    startDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    status: "active",
  },
  {
    id: "pl_005",
    userId: "user_123",
    name: "Old Workshop",
    currency: "USD",
    reference: "WORKSHOP_OLD_001",
    description: "Past workshop recording and materials",
    shareUrl: "https://creatorpay.com/pay/old-workshop",
    startDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
    expiryDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
    status: "expired",
  },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "txn_001",
    userId: "user_123",
    amount: 50,
    type: "donation",
    status: "completed",
    description: "Support my content!",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    fromUser: {
      username: "john_fan",
      profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    },
  },
  {
    id: "txn_002",
    userId: "user_123",
    amount: 100,
    type: "payment_link",
    status: "completed",
    description: "Coaching session",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    fromUser: {
      username: "sarah_buyer",
      profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    },
  },
  {
    id: "txn_003",
    userId: "user_123",
    amount: 25,
    type: "donation",
    status: "completed",
    description: null,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    fromUser: {
      username: "mike_fan",
      profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
    },
  },
  {
    id: "txn_004",
    userId: "user_123",
    amount: 75,
    type: "payment_request",
    status: "completed",
    description: "Sponsorship deal",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    fromUser: {
      username: "brand_co",
      profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=brand",
    },
  },
  {
    id: "txn_005",
    userId: "user_123",
    amount: 150,
    type: "payment_link",
    status: "completed",
    description: "Masterclass bundle",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    fromUser: {
      username: "emma_student",
      profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
    },
  },
];

export const MOCK_PAYOUTS: Payout[] = [
  {
    id: "payout_001",
    userId: "user_123",
    amount: 1000,
    status: "completed",
    method: "bank_transfer",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000),
  },
  {
    id: "payout_002",
    userId: "user_123",
    amount: 750,
    status: "completed",
    method: "stripe",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
  },
  {
    id: "payout_003",
    userId: "user_123",
    amount: 500,
    status: "processing",
    method: "paypal",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "payout_004",
    userId: "user_123",
    amount: 1200,
    status: "pending",
    method: "bank_transfer",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
];

export const generateMockChartData = (
  period: "daily" | "weekly" | "monthly" | "yearly"
) => {
  const data: { name: string; earnings: number; transactions: number }[] = [];

  if (period === "daily") {
    for (let i = 29; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const formatter = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      });
      data.push({
        name: formatter.format(date),
        earnings: Math.floor(Math.random() * 500 + 50),
        transactions: Math.floor(Math.random() * 10 + 1),
      });
    }
  } else if (period === "weekly") {
    for (let i = 11; i >= 0; i--) {
      const date = new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000);
      const formatter = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      });
      data.push({
        name: `Week ${12 - i}`,
        earnings: Math.floor(Math.random() * 3000 + 500),
        transactions: Math.floor(Math.random() * 50 + 5),
      });
    }
  } else if (period === "monthly") {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    for (let i = 11; i >= 0; i--) {
      const monthIndex = (new Date().getMonth() - i + 12) % 12;
      data.push({
        name: months[monthIndex],
        earnings: Math.floor(Math.random() * 15000 + 2000),
        transactions: Math.floor(Math.random() * 200 + 20),
      });
    }
  } else {
    const currentYear = new Date().getFullYear();
    for (let i = 4; i >= 0; i--) {
      const year = currentYear - i;
      data.push({
        name: year.toString(),
        earnings: Math.floor(Math.random() * 100000 + 20000),
        transactions: Math.floor(Math.random() * 2000 + 200),
      });
    }
  }

  return data;
};

export const getMockDashboardStats = (): DashboardStats => {
  const totalTransactions = MOCK_TRANSACTIONS.length;
  const totalEarnings = MOCK_TRANSACTIONS.reduce((sum, t) => sum + t.amount, 0);
  const todayTransactions = MOCK_TRANSACTIONS.filter(
    (t) => new Date(t.createdAt).toDateString() === new Date().toDateString()
  );
  const todayEarnings = todayTransactions.reduce((sum, t) => sum + t.amount, 0);
  const pendingPayouts = MOCK_PAYOUTS.filter(
    (p) => p.status === "pending" || p.status === "processing"
  ).reduce((sum, p) => sum + p.amount, 0);

  return {
    totalEarnings,
    todayEarnings,
    pendingPayouts,
    totalTransactions,
  };
};

