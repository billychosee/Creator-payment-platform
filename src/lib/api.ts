import { User, Transaction, Payout, PaymentLink, PaymentRequest, DashboardStats, SocialLinks } from '@/types';
import { LocalDatabase } from '@/services/localDatabase';

// API Provider Types
export type APIProvider = 'localStorage' | 'supabase' | 'custom' | 'mock';

export interface APIConfig {
  provider: APIProvider;
  enabled: boolean;
  apiKey?: string;
  baseUrl?: string;
  projectUrl?: string;
  anonKey?: string;
  serviceRoleKey?: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  supabaseServiceKey?: string;
}

// API Response Types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Base API Interface
export interface BaseAPI {
  // User Management
  createUser(userData: {
    username: string;
    email: string;
    password: string;
    tagline: string;
    bio?: string;
    socialLinks?: Partial<SocialLinks>;
  }): Promise<APIResponse<User>>;
  
  getUserByEmail(email: string): Promise<APIResponse<User | null>>;
  getUserByUsername(username: string): Promise<APIResponse<User | null>>;
  updateUser(userId: string, updates: Partial<User>): Promise<APIResponse<User | null>>;
  setCurrentUser(userId: string): Promise<APIResponse<void>>;
  getCurrentUser(): Promise<APIResponse<User | null>>;
  logout(): Promise<APIResponse<void>>;
  
  // Authentication
  authenticate(email: string, password: string): Promise<APIResponse<User | null>>;
  
  // Transactions
  createTransaction(transactionData: {
    userId: string;
    amount: number;
    type: "donation" | "payment_link" | "payment_request";
    status: "completed" | "pending" | "failed";
    description?: string;
    fromUser?: {
      username: string;
      profileImage?: string;
    };
  }): Promise<APIResponse<Transaction>>;
  
  getTransactions(userId?: string): Promise<APIResponse<Transaction[]>>;
  
  // Payouts
  createPayout(payoutData: {
    userId: string;
    amount: number;
    method: "bank_transfer" | "paypal" | "stripe";
    status?: "pending" | "processing" | "completed" | "failed";
  }): Promise<APIResponse<Payout>>;
  
  getPayouts(userId?: string): Promise<APIResponse<Payout[]>>;
  updatePayoutStatus(payoutId: string, status: Payout["status"], completedAt?: Date): Promise<APIResponse<Payout | null>>;
  
  // Payment Links
  createPaymentLink(linkData: {
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
  }): Promise<APIResponse<PaymentLink>>;
  
  getPaymentLinks(userId?: string): Promise<APIResponse<PaymentLink[]>>;
  updatePaymentLinkStatus(linkId: string, status: PaymentLink["status"]): Promise<APIResponse<PaymentLink | null>>;
  
  // Payment Requests
  createPaymentRequest(requestData: {
    userId: string;
    recipientEmail: string;
    amount: number;
    reason: string;
    status?: "pending" | "accepted" | "rejected";
  }): Promise<APIResponse<PaymentRequest>>;
  
  getPaymentRequests(userId?: string): Promise<APIResponse<PaymentRequest[]>>;
  updatePaymentRequestStatus(requestId: string, status: PaymentRequest["status"]): Promise<APIResponse<PaymentRequest | null>>;
  
  // Dashboard Stats
  getDashboardStats(userId: string): Promise<APIResponse<DashboardStats>>;
}

// Mock API Implementation (for testing)
class MockAPI implements BaseAPI {
  async createUser(userData: any): Promise<APIResponse<User>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = LocalDatabase.createUser(userData);
    LocalDatabase.setCurrentUser(user.id);
    
    return {
      success: true,
      data: user,
      message: 'User created successfully'
    };
  }
  
  async getUserByEmail(email: string): Promise<APIResponse<User | null>> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
      success: true,
      data: LocalDatabase.getUserByEmail(email)
    };
  }
  
  async getUserByUsername(username: string): Promise<APIResponse<User | null>> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
      success: true,
      data: LocalDatabase.getUserByUsername(username)
    };
  }
  
  async updateUser(userId: string, updates: Partial<User>): Promise<APIResponse<User | null>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const updatedUser = LocalDatabase.updateUser(userId, updates);
    return {
      success: true,
      data: updatedUser,
      message: 'User updated successfully'
    };
  }
  
  async setCurrentUser(userId: string): Promise<APIResponse<void>> {
    await new Promise(resolve => setTimeout(resolve, 100));
    LocalDatabase.setCurrentUser(userId);
    return {
      success: true,
      message: 'Current user set successfully'
    };
  }
  
  async getCurrentUser(): Promise<APIResponse<User | null>> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return {
      success: true,
      data: LocalDatabase.getCurrentUser()
    };
  }
  
  async logout(): Promise<APIResponse<void>> {
    await new Promise(resolve => setTimeout(resolve, 100));
    LocalDatabase.logout();
    return {
      success: true,
      message: 'Logged out successfully'
    };
  }
  
  async authenticate(email: string, password: string): Promise<APIResponse<User | null>> {
    await new Promise(resolve => setTimeout(resolve, 800));
    const user = LocalDatabase.authenticate(email, password);
    return {
      success: !!user,
      data: user,
      message: user ? 'Authentication successful' : 'Invalid credentials'
    };
  }
  
  async createTransaction(transactionData: any): Promise<APIResponse<Transaction>> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const transaction = LocalDatabase.createTransaction(transactionData);
    return {
      success: true,
      data: transaction,
      message: 'Transaction created successfully'
    };
  }
  
  async getTransactions(userId?: string): Promise<APIResponse<Transaction[]>> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
      success: true,
      data: LocalDatabase.getTransactions(userId)
    };
  }
  
  async createPayout(payoutData: any): Promise<APIResponse<Payout>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const payout = LocalDatabase.createPayout(payoutData);
    return {
      success: true,
      data: payout,
      message: 'Payout created successfully'
    };
  }
  
  async getPayouts(userId?: string): Promise<APIResponse<Payout[]>> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
      success: true,
      data: LocalDatabase.getPayouts(userId)
    };
  }
  
  async updatePayoutStatus(payoutId: string, status: Payout["status"], completedAt?: Date): Promise<APIResponse<Payout | null>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const updatedPayout = LocalDatabase.updatePayoutStatus(payoutId, status, completedAt);
    return {
      success: true,
      data: updatedPayout,
      message: 'Payout status updated successfully'
    };
  }
  
  async createPaymentLink(linkData: any): Promise<APIResponse<PaymentLink>> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const paymentLink = LocalDatabase.createPaymentLink(linkData);
    return {
      success: true,
      data: paymentLink,
      message: 'Payment link created successfully'
    };
  }
  
  async getPaymentLinks(userId?: string): Promise<APIResponse<PaymentLink[]>> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
      success: true,
      data: LocalDatabase.getPaymentLinks(userId)
    };
  }
  
  async updatePaymentLinkStatus(linkId: string, status: PaymentLink["status"]): Promise<APIResponse<PaymentLink | null>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const updatedLink = LocalDatabase.updatePaymentLinkStatus(linkId, status);
    return {
      success: true,
      data: updatedLink,
      message: 'Payment link status updated successfully'
    };
  }
  
  async createPaymentRequest(requestData: any): Promise<APIResponse<PaymentRequest>> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const paymentRequest = LocalDatabase.createPaymentRequest(requestData);
    return {
      success: true,
      data: paymentRequest,
      message: 'Payment request created successfully'
    };
  }
  
  async getPaymentRequests(userId?: string): Promise<APIResponse<PaymentRequest[]>> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
      success: true,
      data: LocalDatabase.getPaymentRequests(userId)
    };
  }
  
  async updatePaymentRequestStatus(requestId: string, status: PaymentRequest["status"]): Promise<APIResponse<PaymentRequest | null>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const updatedRequest = LocalDatabase.updatePaymentRequestStatus(requestId, status);
    return {
      success: true,
      data: updatedRequest,
      message: 'Payment request status updated successfully'
    };
  }
  
  async getDashboardStats(userId: string): Promise<APIResponse<DashboardStats>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const stats = LocalDatabase.getDashboardStats(userId);
    return {
      success: true,
      data: stats
    };
  }
}

// Supabase API Implementation
class SupabaseAPI implements BaseAPI {
  private supabaseUrl: string;
  private supabaseKey: string;
  
  constructor(config: APIConfig) {
    this.supabaseUrl = config.supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    this.supabaseKey = config.supabaseAnonKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    
    if (!this.supabaseUrl || !this.supabaseKey) {
      throw new Error('Supabase URL and Anon Key are required for Supabase API');
    }
  }
  
  // Helper method for making requests
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<APIResponse<T>> {
    try {
      const response = await fetch(`${this.supabaseUrl}/rest/v1/${endpoint}`, {
        ...options,
        headers: {
          'apikey': this.supabaseKey,
          'Authorization': `Bearer ${this.supabaseKey}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
  
  async createUser(userData: any): Promise<APIResponse<User>> {
    // Supabase Auth would handle user creation
    return this.request<User>('users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }
  
  async getUserByEmail(email: string): Promise<APIResponse<User | null>> {
    return this.request<User>(`users?email=eq.${email}`);
  }
  
  async getUserByUsername(username: string): Promise<APIResponse<User | null>> {
    return this.request<User>(`users?username=eq.${username}`);
  }
  
  async updateUser(userId: string, updates: Partial<User>): Promise<APIResponse<User | null>> {
    return this.request<User>(`users?id=eq.${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  }
  
  async setCurrentUser(userId: string): Promise<APIResponse<void>> {
    // For client-side state management
    if (typeof window !== 'undefined') {
      localStorage.setItem('supabase_user_id', userId);
    }
    return { success: true, message: 'Current user set' };
  }
  
  async getCurrentUser(): Promise<APIResponse<User | null>> {
    if (typeof window === 'undefined') return { success: true, data: null };
    
    const userId = localStorage.getItem('supabase_user_id');
    if (!userId) return { success: true, data: null };
    
    return this.getUserById(userId);
  }
  
  private async getUserById(userId: string): Promise<APIResponse<User | null>> {
    return this.request<User>(`users?id=eq.${userId}`);
  }
  
  async logout(): Promise<APIResponse<void>> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('supabase_user_id');
    }
    return { success: true, message: 'Logged out successfully' };
  }
  
  async authenticate(email: string, password: string): Promise<APIResponse<User | null>> {
    // This would use Supabase Auth
    try {
      const response = await fetch(`${this.supabaseUrl}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'apikey': this.supabaseKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        return {
          success: false,
          error: 'Invalid credentials'
        };
      }
      
      const authData = await response.json();
      if (authData.user) {
        await this.setCurrentUser(authData.user.id);
        return {
          success: true,
          data: authData.user as User,
          message: 'Authentication successful'
        };
      }
      
      return {
        success: false,
        error: 'Authentication failed'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Authentication error'
      };
    }
  }
  
  // Implement other methods similarly...
  // For brevity, I'll add basic implementations that throw not implemented
  async createTransaction(transactionData: any): Promise<APIResponse<Transaction>> {
    return this.request<Transaction>('transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData)
    });
  }
  
  async getTransactions(userId?: string): Promise<APIResponse<Transaction[]>> {
    const query = userId ? `transactions?user_id=eq.${userId}` : 'transactions';
    return this.request<Transaction[]>(query);
  }
  
  async createPayout(payoutData: any): Promise<APIResponse<Payout>> {
    return this.request<Payout>('payouts', {
      method: 'POST',
      body: JSON.stringify(payoutData)
    });
  }
  
  async getPayouts(userId?: string): Promise<APIResponse<Payout[]>> {
    const query = userId ? `payouts?user_id=eq.${userId}` : 'payouts';
    return this.request<Payout[]>(query);
  }
  
  async updatePayoutStatus(payoutId: string, status: Payout["status"], completedAt?: Date): Promise<APIResponse<Payout | null>> {
    const updateData = { status, ...(completedAt && { completed_at: completedAt.toISOString() }) };
    return this.request<Payout>(`payouts?id=eq.${payoutId}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData)
    });
  }
  
  async createPaymentLink(linkData: any): Promise<APIResponse<PaymentLink>> {
    return this.request<PaymentLink>('payment_links', {
      method: 'POST',
      body: JSON.stringify(linkData)
    });
  }
  
  async getPaymentLinks(userId?: string): Promise<APIResponse<PaymentLink[]>> {
    const query = userId ? `payment_links?user_id=eq.${userId}` : 'payment_links';
    return this.request<PaymentLink[]>(query);
  }
  
  async updatePaymentLinkStatus(linkId: string, status: PaymentLink["status"]): Promise<APIResponse<PaymentLink | null>> {
    return this.request<PaymentLink>(`payment_links?id=eq.${linkId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }
  
  async createPaymentRequest(requestData: any): Promise<APIResponse<PaymentRequest>> {
    return this.request<PaymentRequest>('payment_requests', {
      method: 'POST',
      body: JSON.stringify(requestData)
    });
  }
  
  async getPaymentRequests(userId?: string): Promise<APIResponse<PaymentRequest[]>> {
    const query = userId ? `payment_requests?user_id=eq.${userId}` : 'payment_requests';
    return this.request<PaymentRequest[]>(query);
  }
  
  async updatePaymentRequestStatus(requestId: string, status: PaymentRequest["status"]): Promise<APIResponse<PaymentRequest | null>> {
    return this.request<PaymentRequest>(`payment_requests?id=eq.${requestId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }
  
  async getDashboardStats(userId: string): Promise<APIResponse<DashboardStats>> {
    try {
      // This would be a custom function or view in Supabase
      const response = await fetch(`${this.supabaseUrl}/rest/v1/rpc/get_dashboard_stats`, {
        method: 'POST',
        headers: {
          'apikey': this.supabaseKey,
          'Authorization': `Bearer ${this.supabaseKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: userId })
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }
      
      const stats = await response.json();
      return {
        success: true,
        data: stats
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch dashboard stats'
      };
    }
  }
}

// Custom API Implementation
class CustomAPI implements BaseAPI {
  private baseUrl: string;
  private apiKey: string;
  
  constructor(config: APIConfig) {
    this.baseUrl = config.baseUrl || process.env.NEXT_PUBLIC_API_URL || '';
    this.apiKey = config.apiKey || process.env.NEXT_PUBLIC_API_KEY || '';
    
    if (!this.baseUrl || !this.apiKey) {
      throw new Error('Base URL and API Key are required for Custom API');
    }
  }
  
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<APIResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
  
  async createUser(userData: any): Promise<APIResponse<User>> {
    return this.request<User>('/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }
  
  async getUserByEmail(email: string): Promise<APIResponse<User | null>> {
    return this.request<User>(`/users/email/${encodeURIComponent(email)}`);
  }
  
  async getUserByUsername(username: string): Promise<APIResponse<User | null>> {
    return this.request<User>(`/users/username/${encodeURIComponent(username)}`);
  }
  
  async updateUser(userId: string, updates: Partial<User>): Promise<APIResponse<User | null>> {
    return this.request<User>(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }
  
  async setCurrentUser(userId: string): Promise<APIResponse<void>> {
    if (typeof window !== 'undefined') {
      localStorage.setItem('custom_api_user_id', userId);
    }
    return { success: true, message: 'Current user set' };
  }
  
  async getCurrentUser(): Promise<APIResponse<User | null>> {
    if (typeof window === 'undefined') return { success: true, data: null };
    
    const userId = localStorage.getItem('custom_api_user_id');
    if (!userId) return { success: true, data: null };
    
    return this.getUserById(userId);
  }
  
  private async getUserById(userId: string): Promise<APIResponse<User | null>> {
    return this.request<User>(`/users/${userId}`);
  }
  
  async logout(): Promise<APIResponse<void>> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('custom_api_user_id');
    }
    return { success: true, message: 'Logged out successfully' };
  }
  
  async authenticate(email: string, password: string): Promise<APIResponse<User | null>> {
    return this.request<User>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }
  
  async createTransaction(transactionData: any): Promise<APIResponse<Transaction>> {
    return this.request<Transaction>('/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData)
    });
  }
  
  async getTransactions(userId?: string): Promise<APIResponse<Transaction[]>> {
    const query = userId ? `/transactions?user_id=${userId}` : '/transactions';
    return this.request<Transaction[]>(query);
  }
  
  async createPayout(payoutData: any): Promise<APIResponse<Payout>> {
    return this.request<Payout>('/payouts', {
      method: 'POST',
      body: JSON.stringify(payoutData)
    });
  }
  
  async getPayouts(userId?: string): Promise<APIResponse<Payout[]>> {
    const query = userId ? `/payouts?user_id=${userId}` : '/payouts';
    return this.request<Payout[]>(query);
  }
  
  async updatePayoutStatus(payoutId: string, status: Payout["status"], completedAt?: Date): Promise<APIResponse<Payout | null>> {
    const updateData = { status, ...(completedAt && { completed_at: completedAt.toISOString() }) };
    return this.request<Payout>(`/payouts/${payoutId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
  }
  
  async createPaymentLink(linkData: any): Promise<APIResponse<PaymentLink>> {
    return this.request<PaymentLink>('/payment-links', {
      method: 'POST',
      body: JSON.stringify(linkData)
    });
  }
  
  async getPaymentLinks(userId?: string): Promise<APIResponse<PaymentLink[]>> {
    const query = userId ? `/payment-links?user_id=${userId}` : '/payment-links';
    return this.request<PaymentLink[]>(query);
  }
  
  async updatePaymentLinkStatus(linkId: string, status: PaymentLink["status"]): Promise<APIResponse<PaymentLink | null>> {
    return this.request<PaymentLink>(`/payment-links/${linkId}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }
  
  async createPaymentRequest(requestData: any): Promise<APIResponse<PaymentRequest>> {
    return this.request<PaymentRequest>('/payment-requests', {
      method: 'POST',
      body: JSON.stringify(requestData)
    });
  }
  
  async getPaymentRequests(userId?: string): Promise<APIResponse<PaymentRequest[]>> {
    const query = userId ? `/payment-requests?user_id=${userId}` : '/payment-requests';
    return this.request<PaymentRequest[]>(query);
  }
  
  async updatePaymentRequestStatus(requestId: string, status: PaymentRequest["status"]): Promise<APIResponse<PaymentRequest | null>> {
    return this.request<PaymentRequest>(`/payment-requests/${requestId}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }
  
  async getDashboardStats(userId: string): Promise<APIResponse<DashboardStats>> {
    return this.request<DashboardStats>(`/dashboard/stats/${userId}`);
  }
}

// Main API Manager
export class APIManager {
  private static instance: APIManager;
  private currentAPI: BaseAPI | null = null;
  private config: APIConfig;
  
  private constructor() {
    this.config = this.getDefaultConfig();
    this.initializeAPI();
  }
  
  public static getInstance(): APIManager {
    if (!APIManager.instance) {
      APIManager.instance = new APIManager();
    }
    return APIManager.instance;
  }
  
  private getDefaultConfig(): APIConfig {
    return {
      provider: (process.env.NEXT_PUBLIC_API_PROVIDER as APIProvider) || 'localStorage',
      enabled: process.env.NEXT_PUBLIC_API_ENABLED !== 'false',
      apiKey: process.env.NEXT_PUBLIC_API_KEY,
      baseUrl: process.env.NEXT_PUBLIC_API_URL,
      projectUrl: process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      serviceRoleKey: process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY
    };
  }
  
  private initializeAPI(): void {
    if (!this.config.enabled) {
      this.currentAPI = new MockAPI();
      return;
    }
    
    try {
      switch (this.config.provider) {
        case 'supabase':
          if (this.config.supabaseUrl && this.config.supabaseAnonKey) {
            this.currentAPI = new SupabaseAPI(this.config);
          } else {
            console.warn('Supabase configuration missing, falling back to localStorage');
            this.currentAPI = new MockAPI();
          }
          break;
        case 'custom':
          if (this.config.baseUrl && this.config.apiKey) {
            this.currentAPI = new CustomAPI(this.config);
          } else {
            console.warn('Custom API configuration missing, falling back to localStorage');
            this.currentAPI = new MockAPI();
          }
          break;
        case 'localStorage':
        case 'mock':
        default:
          this.currentAPI = new MockAPI();
          break;
      }
    } catch (error) {
      console.error('Failed to initialize API provider, falling back to localStorage:', error);
      this.currentAPI = new MockAPI();
    }
  }
  
  public configure(config: Partial<APIConfig>): void {
    this.config = { ...this.config, ...config };
    this.initializeAPI();
  }
  
  public getConfig(): APIConfig {
    return { ...this.config };
  }
  
  public getAPI(): BaseAPI {
    if (!this.currentAPI) {
      throw new Error('API not initialized');
    }
    return this.currentAPI;
  }
  
  public isUsingLocalStorage(): boolean {
    return this.config.provider === 'localStorage' || this.config.provider === 'mock' || !this.config.enabled;
  }
  
  public getCurrentProvider(): APIProvider {
    return this.config.provider;
  }
  
  // Convenience methods that delegate to the current API
  async createUser(userData: any) {
    return this.getAPI().createUser(userData);
  }
  
  async getUserByEmail(email: string) {
    return this.getAPI().getUserByEmail(email);
  }
  
  async getUserByUsername(username: string) {
    return this.getAPI().getUserByUsername(username);
  }
  
  async updateUser(userId: string, updates: Partial<User>) {
    return this.getAPI().updateUser(userId, updates);
  }
  
  async setCurrentUser(userId: string) {
    return this.getAPI().setCurrentUser(userId);
  }
  
  async getCurrentUser() {
    return this.getAPI().getCurrentUser();
  }
  
  async logout() {
    return this.getAPI().logout();
  }
  
  async authenticate(email: string, password: string) {
    return this.getAPI().authenticate(email, password);
  }
  
  async createTransaction(transactionData: any) {
    return this.getAPI().createTransaction(transactionData);
  }
  
  async getTransactions(userId?: string) {
    return this.getAPI().getTransactions(userId);
  }
  
  async createPayout(payoutData: any) {
    return this.getAPI().createPayout(payoutData);
  }
  
  async getPayouts(userId?: string) {
    return this.getAPI().getPayouts(userId);
  }
  
  async updatePayoutStatus(payoutId: string, status: Payout["status"], completedAt?: Date) {
    return this.getAPI().updatePayoutStatus(payoutId, status, completedAt);
  }
  
  async createPaymentLink(linkData: any) {
    return this.getAPI().createPaymentLink(linkData);
  }
  
  async getPaymentLinks(userId?: string) {
    return this.getAPI().getPaymentLinks(userId);
  }
  
  async updatePaymentLinkStatus(linkId: string, status: PaymentLink["status"]) {
    return this.getAPI().updatePaymentLinkStatus(linkId, status);
  }
  
  async createPaymentRequest(requestData: any) {
    return this.getAPI().createPaymentRequest(requestData);
  }
  
  async getPaymentRequests(userId?: string) {
    return this.getAPI().getPaymentRequests(userId);
  }
  
  async updatePaymentRequestStatus(requestId: string, status: PaymentRequest["status"]) {
    return this.getAPI().updatePaymentRequestStatus(requestId, status);
  }
  
  async getDashboardStats(userId: string) {
    return this.getAPI().getDashboardStats(userId);
  }
}

// Export singleton instance
export const api = APIManager.getInstance();