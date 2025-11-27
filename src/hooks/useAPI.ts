import { useState, useCallback } from 'react';
import { api, APIResponse } from '@/lib/api';

interface UseAPIOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  showToast?: boolean;
}

interface UseAPIReturn<T> {
  loading: boolean;
  error: string | null;
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

/**
 * Custom hook for handling API calls with loading and error states
 * Works with any API provider (localStorage, Supabase, Custom)
 */
export function useAPI<T = any>(
  apiFunction: (...args: any[]) => Promise<APIResponse<T>>,
  options: UseAPIOptions<T> = {}
): UseAPIReturn<T> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  const execute = useCallback(async (...args: any[]): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiFunction(...args);
      
      if (response.success && response.data) {
        options.onSuccess?.(response.data);
        return response.data;
      } else {
        const errorMessage = response.error || response.message || 'An error occurred';
        setError(errorMessage);
        options.onError?.(errorMessage);
        
        if (options.showToast) {
          // You can integrate with your toast library here
          console.error('API Error:', errorMessage);
        }
        
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      options.onError?.(errorMessage);
      
      if (options.showToast) {
        console.error('API Error:', errorMessage);
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, options]);

  return {
    loading,
    error,
    execute,
    reset
  };
}

/**
 * Hook for managing user authentication state
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.authenticate(email, password);
      if (response.success && response.data) {
        setUser(response.data);
        return { success: true, user: response.data };
      }
      return { success: false, error: response.error };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Login failed' };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await api.logout();
      setUser(null);
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Logout failed' };
    } finally {
      setLoading(false);
    }
  }, []);

  const getCurrentUser = useCallback(async () => {
    try {
      const response = await api.getCurrentUser();
      if (response.success) {
        setUser(response.data);
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }, []);

  return {
    user,
    loading,
    login,
    logout,
    getCurrentUser,
    isAuthenticated: !!user
  };
}

/**
 * Hook for checking current API provider status
 */
export function useAPIProvider() {
  const [provider, setProvider] = useState(api.getCurrentProvider());
  const [config, setConfig] = useState(api.getConfig());
  const [isUsingLocalStorage, setIsUsingLocalStorage] = useState(api.isUsingLocalStorage());

  const refreshConfig = useCallback(() => {
    setProvider(api.getCurrentProvider());
    setConfig(api.getConfig());
    setIsUsingLocalStorage(api.isUsingLocalStorage());
  }, []);

  const switchProvider = useCallback((newProvider: 'localStorage' | 'supabase' | 'custom' | 'mock') => {
    api.configure({ provider: newProvider });
    refreshConfig();
  }, [refreshConfig]);

  return {
    provider,
    config,
    isUsingLocalStorage,
    refreshConfig,
    switchProvider,
    availableProviders: ['localStorage', 'mock', 'supabase', 'custom'] as const
  };
}

export default useAPI;
