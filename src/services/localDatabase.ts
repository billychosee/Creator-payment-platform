import { User, Transaction, Payout, PaymentLink, PaymentRequest, DashboardStats, SocialLinks } from "@/types";

// Local Database Keys
const DB_KEYS = {
  USERS: "creator_payments_users",
  CURRENT_USER: "creator_payments_current_user",
  TRANSACTIONS: "creator_payments_transactions",
  PAYOUTS: "creator_payments_payouts",
  PAYMENT_LINKS: "creator_payments_payment_links",
  PAYMENT_REQUESTS: "creator_payments_payment_requests",
  NEXT_IDS: "creator_payments_next_ids"
} as const;

// Next ID Table Keys
const NEXT_ID_TABLE_KEYS = {
  USERS: "users",
  TRANSACTIONS: "transactions",
  PAYOUTS: "payouts",
  PAYMENT_LINKS: "paymentLinks",
  PAYMENT_REQUESTS: "paymentRequests"
} as const;

type NextIdTableKey = typeof NEXT_ID_TABLE_KEYS[keyof typeof NEXT_ID_TABLE_KEYS];

// Generate unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Local Database Service
export class LocalDatabase {
  // Check if we're in the browser before accessing localStorage
  private static checkLocalStorageAccess(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const testKey = '__localStorage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  // Initialize with sample data if empty (client-side only)
  static initialize() {
    if (!this.checkLocalStorageAccess()) return;
    
    if (!localStorage.getItem(DB_KEYS.NEXT_IDS)) {
      const nextIds = {
        users: 1,
        transactions: 1,
        payouts: 1,
        paymentLinks: 1,
        paymentRequests: 1
      };
      localStorage.setItem(DB_KEYS.NEXT_IDS, JSON.stringify(nextIds));
    }

    // Add some sample data if empty
    this.addSampleData();
  }

  // Add sample data for demonstration
  static addSampleData() {
    if (!this.checkLocalStorageAccess()) return;

    const sampleUser: User = {
      id: "demo-user-1",
      username: "demo_creator",
      email: "demo@example.com",
      tagline: "Content Creator | Digital Artist",
      bio: "I create amazing digital content and love connecting with my community!",
      profileImage: "",
      socialLinks: {
        twitter: "@demo_creator",
        instagram: "@demo_creator",
        youtube: "Demo Creator Channel"
      },
      createdAt: new Date()
    };

    const sampleTransactions: Transaction[] = [
      {
        id: "txn-1",
        userId: "demo-user-1",
        amount: 25.50,
        type: "donation",
        status: "completed",
        description: "Thank you for the awesome content!",
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
        fromUser: {
          username: "fan123",
          profileImage: ""
        }
      },
      {
        id: "txn-2",
        userId: "demo-user-1",
        amount: 15.00,
        type: "payment_link",
        status: "completed",
        description: "Custom artwork request",
        createdAt: new Date(Date.now() - 172800000), // 2 days ago
        fromUser: {
          username: "artlover",
          profileImage: ""
        }
      }
    ];

    const samplePayouts: Payout[] = [
      {
        id: "payout-1",
        userId: "demo-user-1",
        amount: 35.50,
        status: "completed",
        method: "bank_transfer",
        createdAt: new Date(Date.now() - 259200000), // 3 days ago
        completedAt: new Date(Date.now() - 86400000) // 1 day ago
      }
    ];

    const samplePaymentLinks: PaymentLink[] = [
      {
        id: "link-1",
        userId: "demo-user-1",
        name: "Custom Art Commission",
        currency: "USD",
        reference: "CUSTOM-ART",
        description: "Commission me for custom digital artwork",
        shareUrl: "https://payments.example.com/l/custom-art",
        logo: "",
        createdAt: new Date(),
        status: "active"
      }
    ];

    // Only add sample data if no data exists
    if (!localStorage.getItem(DB_KEYS.USERS)) {
      localStorage.setItem(DB_KEYS.USERS, JSON.stringify([sampleUser]));
      localStorage.setItem(DB_KEYS.TRANSACTIONS, JSON.stringify(sampleTransactions));
      localStorage.setItem(DB_KEYS.PAYOUTS, JSON.stringify(samplePayouts));
      localStorage.setItem(DB_KEYS.PAYMENT_LINKS, JSON.stringify(samplePaymentLinks));
      localStorage.setItem(DB_KEYS.PAYMENT_REQUESTS, JSON.stringify([]));
    }
  }

  // Get next ID for a table
  private static getNextId(table: NextIdTableKey): string {
    if (!this.checkLocalStorageAccess()) throw new Error("localStorage not available");
    
    const nextIds = JSON.parse(localStorage.getItem(DB_KEYS.NEXT_IDS) || "{}");
    const id = nextIds[table] || 1;
    nextIds[table] = (id as number) + 1;
    localStorage.setItem(DB_KEYS.NEXT_IDS, JSON.stringify(nextIds));
    return `${table.slice(0, -1)}-${id}`;
  }

  // User Management
  static createUser(userData: {
    username: string;
    email: string;
    password: string;
    tagline: string;
    bio?: string;
    socialLinks?: Partial<SocialLinks>;
  }): User {
    const newUser: User = {
      id: this.getNextId(NEXT_ID_TABLE_KEYS.USERS),
      username: userData.username,
      email: userData.email,
      tagline: userData.tagline,
      bio: userData.bio || "",
      socialLinks: userData.socialLinks || {},
      createdAt: new Date()
    };

    const users = this.getUsers();
    users.push(newUser);
    if (this.checkLocalStorageAccess()) {
      localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
    }

    return newUser;
  }

  static getUsers(): User[] {
    if (!this.checkLocalStorageAccess()) return [];
    return JSON.parse(localStorage.getItem(DB_KEYS.USERS) || "[]");
  }

  static getUserByEmail(email: string): User | null {
    const users = this.getUsers();
    return users.find(user => user.email === email) || null;
  }

  static getUserByUsername(username: string): User | null {
    const users = this.getUsers();
    return users.find(user => user.username === username) || null;
  }

  static updateUser(userId: string, updates: Partial<User>): User | null {
    const users = this.getUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) return null;

    users[userIndex] = { ...users[userIndex], ...updates };
    if (this.checkLocalStorageAccess()) {
      localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
    }

    return users[userIndex];
  }

  static setCurrentUser(userId: string): void {
    if (!this.checkLocalStorageAccess()) return;
    localStorage.setItem(DB_KEYS.CURRENT_USER, userId);
  }

  static getCurrentUser(): User | null {
    if (!this.checkLocalStorageAccess()) return null;
    
    const currentUserId = localStorage.getItem(DB_KEYS.CURRENT_USER);
    if (!currentUserId) return null;

    const users = this.getUsers();
    return users.find(user => user.id === currentUserId) || null;
  }

  static logout(): void {
    if (!this.checkLocalStorageAccess()) return;
    localStorage.removeItem(DB_KEYS.CURRENT_USER);
  }

  // Authentication
  static authenticate(email: string, password: string): User | null {
    const user = this.getUserByEmail(email);
    if (user) {
      // Store password during authentication attempt
      if (this.checkLocalStorageAccess()) {
        localStorage.setItem(`password_${user.id}`, password);
      }
      
      // For demo purposes, we'll accept any password for existing users
      // In production, this would properly validate the password hash
      this.setCurrentUser(user.id);
      return user;
    }
    return null;
  }

  // Transactions
  static createTransaction(transactionData: {
    userId: string;
    amount: number;
    type: "donation" | "payment_link" | "payment_request";
    status: "completed" | "pending" | "failed";
    description?: string;
    fromUser?: {
      username: string;
      profileImage?: string;
    };
  }): Transaction {
    const newTransaction: Transaction = {
      id: this.getNextId(NEXT_ID_TABLE_KEYS.TRANSACTIONS),
      userId: transactionData.userId,
      amount: transactionData.amount,
      type: transactionData.type,
      status: transactionData.status,
      description: transactionData.description,
      createdAt: new Date(),
      fromUser: transactionData.fromUser
    };

    const transactions = this.getTransactions();
    transactions.push(newTransaction);
    if (this.checkLocalStorageAccess()) {
      localStorage.setItem(DB_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    }

    return newTransaction;
  }

  static getTransactions(userId?: string): Transaction[] {
    if (!this.checkLocalStorageAccess()) return [];
    const transactions = JSON.parse(localStorage.getItem(DB_KEYS.TRANSACTIONS) || "[]");
    return userId ? transactions.filter((txn: Transaction) => txn.userId === userId) : transactions;
  }

  // Payouts
  static createPayout(payoutData: {
    userId: string;
    amount: number;
    method: "bank_transfer" | "paypal" | "stripe";
    status?: "pending" | "processing" | "completed" | "failed";
  }): Payout {
    const newPayout: Payout = {
      id: this.getNextId(NEXT_ID_TABLE_KEYS.PAYOUTS),
      userId: payoutData.userId,
      amount: payoutData.amount,
      method: payoutData.method,
      status: payoutData.status || "pending",
      createdAt: new Date()
    };

    const payouts = this.getPayouts();
    payouts.push(newPayout);
    if (this.checkLocalStorageAccess()) {
      localStorage.setItem(DB_KEYS.PAYOUTS, JSON.stringify(payouts));
    }

    return newPayout;
  }

  static getPayouts(userId?: string): Payout[] {
    if (!this.checkLocalStorageAccess()) return [];
    const payouts = JSON.parse(localStorage.getItem(DB_KEYS.PAYOUTS) || "[]");
    return userId ? payouts.filter((payout: Payout) => payout.userId === userId) : payouts;
  }

  static updatePayoutStatus(payoutId: string, status: Payout["status"], completedAt?: Date): Payout | null {
    const payouts = this.getPayouts();
    const payoutIndex = payouts.findIndex(payout => payout.id === payoutId);
    
    if (payoutIndex === -1) return null;

    payouts[payoutIndex] = {
      ...payouts[payoutIndex],
      status,
      ...(completedAt && { completedAt })
    };
    if (this.checkLocalStorageAccess()) {
      localStorage.setItem(DB_KEYS.PAYOUTS, JSON.stringify(payouts));
    }

    return payouts[payoutIndex];
  }

  // Payment Links
  static createPaymentLink(linkData: {
    userId: string;
    name: string;
    currency: string;
    reference: string;
    description: string;
    logo?: string;
    customerRedirectUrl?: string;
    customerFailRedirectUrl?: string;
    startDate?: Date;
    expiryDate?: Date;
  }): PaymentLink {
    const newPaymentLink: PaymentLink = {
      id: this.getNextId(NEXT_ID_TABLE_KEYS.PAYMENT_LINKS),
      userId: linkData.userId,
      name: linkData.name,
      currency: linkData.currency,
      reference: linkData.reference,
      description: linkData.description,
      shareUrl: `https://payments.example.com/l/${linkData.reference}`,
      logo: linkData.logo || "",
      customerRedirectUrl: linkData.customerRedirectUrl,
      customerFailRedirectUrl: linkData.customerFailRedirectUrl,
      startDate: linkData.startDate,
      expiryDate: linkData.expiryDate,
      createdAt: new Date(),
      status: "active"
    };

    const paymentLinks = this.getPaymentLinks();
    paymentLinks.push(newPaymentLink);
    if (this.checkLocalStorageAccess()) {
      localStorage.setItem(DB_KEYS.PAYMENT_LINKS, JSON.stringify(paymentLinks));
    }

    return newPaymentLink;
  }

  static getPaymentLinks(userId?: string): PaymentLink[] {
    if (!this.checkLocalStorageAccess()) return [];
    const paymentLinks = JSON.parse(localStorage.getItem(DB_KEYS.PAYMENT_LINKS) || "[]");
    return userId ? paymentLinks.filter((link: PaymentLink) => link.userId === userId) : paymentLinks;
  }

  static updatePaymentLinkStatus(linkId: string, status: PaymentLink["status"]): PaymentLink | null {
    const paymentLinks = this.getPaymentLinks();
    const linkIndex = paymentLinks.findIndex(link => link.id === linkId);
    
    if (linkIndex === -1) return null;

    paymentLinks[linkIndex] = { ...paymentLinks[linkIndex], status };
    if (this.checkLocalStorageAccess()) {
      localStorage.setItem(DB_KEYS.PAYMENT_LINKS, JSON.stringify(paymentLinks));
    }

    return paymentLinks[linkIndex];
  }

  // Payment Requests
  static createPaymentRequest(requestData: {
    userId: string;
    recipientEmail: string;
    amount: number;
    reason: string;
    status?: "pending" | "accepted" | "rejected";
  }): PaymentRequest {
    const newPaymentRequest: PaymentRequest = {
      id: this.getNextId(NEXT_ID_TABLE_KEYS.PAYMENT_REQUESTS),
      userId: requestData.userId,
      recipientEmail: requestData.recipientEmail,
      amount: requestData.amount,
      reason: requestData.reason,
      status: requestData.status || "pending",
      createdAt: new Date()
    };

    const paymentRequests = this.getPaymentRequests();
    paymentRequests.push(newPaymentRequest);
    if (this.checkLocalStorageAccess()) {
      localStorage.setItem(DB_KEYS.PAYMENT_REQUESTS, JSON.stringify(paymentRequests));
    }

    return newPaymentRequest;
  }

  static getPaymentRequests(userId?: string): PaymentRequest[] {
    if (!this.checkLocalStorageAccess()) return [];
    const paymentRequests = JSON.parse(localStorage.getItem(DB_KEYS.PAYMENT_REQUESTS) || "[]");
    return userId ? paymentRequests.filter((request: PaymentRequest) => request.userId === userId) : paymentRequests;
  }

  static updatePaymentRequestStatus(requestId: string, status: PaymentRequest["status"]): PaymentRequest | null {
    const paymentRequests = this.getPaymentRequests();
    const requestIndex = paymentRequests.findIndex(request => request.id === requestId);
    
    if (requestIndex === -1) return null;

    paymentRequests[requestIndex] = { ...paymentRequests[requestIndex], status };
    localStorage.setItem(DB_KEYS.PAYMENT_REQUESTS, JSON.stringify(paymentRequests));

    return paymentRequests[requestIndex];
  }

  // Dashboard Stats
  static getDashboardStats(userId: string): DashboardStats {
    const transactions = this.getTransactions(userId);
    const payouts = this.getPayouts(userId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalEarnings = transactions
      .filter(txn => txn.status === "completed")
      .reduce((sum, txn) => sum + txn.amount, 0);

    const todayEarnings = transactions
      .filter(txn => txn.status === "completed" && new Date(txn.createdAt) >= today)
      .reduce((sum, txn) => sum + txn.amount, 0);

    const pendingPayouts = payouts
      .filter(payout => payout.status === "pending" || payout.status === "processing")
      .reduce((sum, payout) => sum + payout.amount, 0);

    return {
      totalEarnings,
      todayEarnings,
      pendingPayouts,
      totalTransactions: transactions.length
    };
  }

  // Database Management
  static clearDatabase(): void {
    Object.values(DB_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    this.initialize();
  }

  static exportData(): string {
    const data: Record<string, any> = {};
    Object.entries(DB_KEYS).forEach(([name, key]) => {
      data[name] = JSON.parse(localStorage.getItem(key) || "[]");
    });
    return JSON.stringify(data, null, 2);
  }

  static importData(jsonData: string): void {
    try {
      const data = JSON.parse(jsonData);
      Object.entries(data).forEach(([name, value]) => {
        const key = DB_KEYS[name as keyof typeof DB_KEYS];
        if (key) {
          localStorage.setItem(key, JSON.stringify(value));
        }
      });
    } catch (error) {
      console.error("Failed to import data:", error);
      throw new Error("Invalid data format");
    }
  }
}

// Auto-initialize when imported (client-side only)
if (typeof window !== 'undefined') {
  LocalDatabase.initialize();
}