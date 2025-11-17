// Legacy API service - now uses the new API abstraction layer
import { api, APIResponse } from '@/lib/api';
import { User, Transaction, Payout, PaymentLink, PaymentRequest, DashboardStats, SocialLinks } from '@/types';

// Wrapper service that provides a consistent interface
// but uses the new API abstraction layer internally
export class APIService {
  // User Management
  static async createUser(userData: {
    username: string;
    email: string;
    password: string;
    tagline: string;
    bio?: string;
    socialLinks?: Partial<SocialLinks>;
  }): Promise<User> {
    const response = await api.createUser(userData);
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to create user');
    }
    return response.data;
  }
  
  static async getUserByEmail(email: string): Promise<User | null> {
    const response = await api.getUserByEmail(email);
    if (!response.success) {
      throw new Error(response.error || 'Failed to get user by email');
    }
    return response.data || null;
  }
  
  static async getUserByUsername(username: string): Promise<User | null> {
    const response = await api.getUserByUsername(username);
    if (!response.success) {
      throw new Error(response.error || 'Failed to get user by username');
    }
    return response.data || null;
  }
  
  static async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    const response = await api.updateUser(userId, updates);
    if (!response.success) {
      throw new Error(response.error || 'Failed to update user');
    }
    return response.data;
  }
  
  static async setCurrentUser(userId: string): Promise<void> {
    const response = await api.setCurrentUser(userId);
    if (!response.success) {
      throw new Error(response.error || 'Failed to set current user');
    }
  }
  
  static async getCurrentUser(): Promise<User | null> {
    const response = await api.getCurrentUser();
    if (!response.success) {
      throw new Error(response.error || 'Failed to get current user');
    }
    return response.data;
  }
  
  static async logout(): Promise<void> {
    const response = await api.logout();
    if (!response.success) {
      throw new Error(response.error || 'Failed to logout');
    }
  }
  
  // Authentication
  static async authenticate(email: string, password: string): Promise<User | null> {
    const response = await api.authenticate(email, password);
    if (!response.success) {
      throw new Error(response.error || 'Authentication failed');
    }
    return response.data;
  }
  
  // Transactions
  static async createTransaction(transactionData: {
    userId: string;
    amount: number;
    type: "donation" | "payment_link" | "payment_request";
    status: "completed" | "pending" | "failed";
    description?: string;
    fromUser?: {
      username: string;
      profileImage?: string;
    };
  }): Promise<Transaction> {
    const response = await api.createTransaction(transactionData);
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to create transaction');
    }
    return response.data;
  }
  
  static async getTransactions(userId?: string): Promise<Transaction[]> {
    const response = await api.getTransactions(userId);
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to get transactions');
    }
    return response.data;
  }
  
  // Payouts
  static async createPayout(payoutData: {
    userId: string;
    amount: number;
    method: "bank_transfer" | "paypal" | "stripe";
    status?: "pending" | "processing" | "completed" | "failed";
  }): Promise<Payout> {
    const response = await api.createPayout(payoutData);
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to create payout');
    }
    return response.data;
  }
  
  static async getPayouts(userId?: string): Promise<Payout[]> {
    const response = await api.getPayouts(userId);
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to get payouts');
    }
    return response.data;
  }
  
  static async updatePayoutStatus(
    payoutId: string, 
    status: Payout["status"], 
    completedAt?: Date
  ): Promise<Payout | null> {
    const response = await api.updatePayoutStatus(payoutId, status, completedAt);
    if (!response.success) {
      throw new Error(response.error || 'Failed to update payout status');
    }
    return response.data;
  }
  
  // Payment Links
  static async createPaymentLink(linkData: {
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
  }): Promise<PaymentLink> {
    const response = await api.createPaymentLink(linkData);
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to create payment link');
    }
    return response.data;
  }
  
  static async getPaymentLinks(userId?: string): Promise<PaymentLink[]> {
    const response = await api.getPaymentLinks(userId);
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to get payment links');
    }
    return response.data;
  }
  
  static async updatePaymentLinkStatus(linkId: string, status: PaymentLink["status"]): Promise<PaymentLink | null> {
    const response = await api.updatePaymentLinkStatus(linkId, status);
    if (!response.success) {
      throw new Error(response.error || 'Failed to update payment link status');
    }
    return response.data;
  }
  
  // Payment Requests
  static async createPaymentRequest(requestData: {
    userId: string;
    recipientEmail: string;
    amount: number;
    reason: string;
    status?: "pending" | "accepted" | "rejected";
  }): Promise<PaymentRequest> {
    const response = await api.createPaymentRequest(requestData);
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to create payment request');
    }
    return response.data;
  }
  
  static async getPaymentRequests(userId?: string): Promise<PaymentRequest[]> {
    const response = await api.getPaymentRequests(userId);
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to get payment requests');
    }
    return response.data;
  }
  
  static async updatePaymentRequestStatus(requestId: string, status: PaymentRequest["status"]): Promise<PaymentRequest | null> {
    const response = await api.updatePaymentRequestStatus(requestId, status);
    if (!response.success) {
      throw new Error(response.error || 'Failed to update payment request status');
    }
    return response.data;
  }
  
  // Dashboard Stats
  static async getDashboardStats(userId: string): Promise<DashboardStats> {
    const response = await api.getDashboardStats(userId);
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to get dashboard stats');
    }
    return response.data;
  }
  
  // Utility methods
  static isUsingLocalStorage(): boolean {
    return api.isUsingLocalStorage();
  }
  
  static getCurrentProvider(): string {
    return api.getCurrentProvider();
  }
  
  static getConfig() {
    return api.getConfig();
  }
}

// Export convenience functions for easier importing
export const createUser = APIService.createUser.bind(APIService);
export const getUserByEmail = APIService.getUserByEmail.bind(APIService);
export const getUserByUsername = APIService.getUserByUsername.bind(APIService);
export const updateUser = APIService.updateUser.bind(APIService);
export const setCurrentUser = APIService.setCurrentUser.bind(APIService);
export const getCurrentUser = APIService.getCurrentUser.bind(APIService);
export const logout = APIService.logout.bind(APIService);
export const authenticate = APIService.authenticate.bind(APIService);
export const createTransaction = APIService.createTransaction.bind(APIService);
export const getTransactions = APIService.getTransactions.bind(APIService);
export const createPayout = APIService.createPayout.bind(APIService);
export const getPayouts = APIService.getPayouts.bind(APIService);
export const updatePayoutStatus = APIService.updatePayoutStatus.bind(APIService);
export const createPaymentLink = APIService.createPaymentLink.bind(APIService);
export const getPaymentLinks = APIService.getPaymentLinks.bind(APIService);
export const updatePaymentLinkStatus = APIService.updatePaymentLinkStatus.bind(APIService);
export const createPaymentRequest = APIService.createPaymentRequest.bind(APIService);
export const getPaymentRequests = APIService.getPaymentRequests.bind(APIService);
export const updatePaymentRequestStatus = APIService.updatePaymentRequestStatus.bind(APIService);
export const getDashboardStats = APIService.getDashboardStats.bind(APIService);

// Legacy exports for backward compatibility
export default APIService;
