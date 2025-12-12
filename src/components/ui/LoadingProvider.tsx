import React, { createContext, useContext, useState, useCallback } from "react";
import { DefaultLoader } from "@/components/ui/DefaultLoader";
import { APIResponse } from "@/lib/api";

interface LoadingContextType {
  // Global loading state
  loading: boolean;
  globalLoading: boolean;
  error: string | null;

  // Control functions
  setGlobalLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;

  // Enhanced API execution with global loading
  executeWithGlobalLoading: <T>(
    apiCall: () => Promise<APIResponse<T>>,
    options?: {
      showGlobalLoader?: boolean;
      loadingText?: string;
      onSuccess?: (data: T) => void;
      onError?: (error: string) => void;
    }
  ) => Promise<T | null>;

  executeWithGlobalLoadingDirect: <T>(
    apiCall: () => Promise<T>,
    options?: {
      showGlobalLoader?: boolean;
      loadingText?: string;
      onSuccess?: (data: T) => void;
      onError?: (error: string) => void;
    }
  ) => Promise<T | null>;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: React.ReactNode;
  /**
   * Default text for global loading
   * @default "Loading..."
   */
  defaultLoadingText?: string;

  /**
   * Show global loader overlay
   * @default true
   */
  showGlobalLoader?: boolean;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({
  children,
  defaultLoadingText = "Loading...",
  showGlobalLoader = true,
}) => {
  const [loading, setLoading] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setGlobalLoading(false);
    setError(null);
  }, []);

  const setErrorWithReset = useCallback((errorMessage: string | null) => {
    setError(errorMessage);
  }, []);

  const executeWithGlobalLoading = useCallback(
    <T,>(
      apiCall: () => Promise<APIResponse<T>>,
      options: {
        showGlobalLoader?: boolean;
        loadingText?: string;
        onSuccess?: (data: T) => void;
        onError?: (error: string) => void;
      } = {}
    ): Promise<T | null> => {
      const {
        showGlobalLoader = true,
        loadingText = defaultLoadingText,
        onSuccess,
        onError,
      } = options;

      // Set appropriate loading state
      if (showGlobalLoader) {
        setGlobalLoading(true);
      } else {
        setLoading(true);
      }
      setError(null);

      return new Promise((resolve) => {
        apiCall()
          .then((response) => {
            if (response.success && response.data) {
              onSuccess?.(response.data);
              resolve(response.data);
            } else {
              const errorMessage = response.error || "An error occurred";
              setError(errorMessage);
              onError?.(errorMessage);
              resolve(null);
            }
          })
          .catch((err) => {
            const errorMessage =
              err instanceof Error
                ? err.message
                : "An unexpected error occurred";
            setError(errorMessage);
            onError?.(errorMessage);
            resolve(null);
          })
          .finally(() => {
            if (showGlobalLoader) {
              setGlobalLoading(false);
            } else {
              setLoading(false);
            }
          });
      });
    },
    [defaultLoadingText]
  );

  const executeWithGlobalLoadingDirect = useCallback(
    <T,>(
      apiCall: () => Promise<T>,
      options: {
        showGlobalLoader?: boolean;
        loadingText?: string;
        onSuccess?: (data: T) => void;
        onError?: (error: string) => void;
      } = {}
    ): Promise<T | null> => {
      const {
        showGlobalLoader = true,
        loadingText = defaultLoadingText,
        onSuccess,
        onError,
      } = options;

      // Set appropriate loading state
      if (showGlobalLoader) {
        setGlobalLoading(true);
      } else {
        setLoading(true);
      }
      setError(null);

      return new Promise((resolve) => {
        apiCall()
          .then((result) => {
            onSuccess?.(result);
            resolve(result);
          })
          .catch((err) => {
            const errorMessage =
              err instanceof Error
                ? err.message
                : "An unexpected error occurred";
            setError(errorMessage);
            onError?.(errorMessage);
            resolve(null);
          })
          .finally(() => {
            if (showGlobalLoader) {
              setGlobalLoading(false);
            } else {
              setLoading(false);
            }
          });
      });
    },
    [defaultLoadingText]
  );

  const contextValue: LoadingContextType = {
    loading,
    globalLoading,
    error,
    setGlobalLoading,
    setError: setErrorWithReset,
    clearError,
    reset,
    executeWithGlobalLoading,
    executeWithGlobalLoadingDirect,
  };

  return (
    <LoadingContext.Provider value={contextValue}>
      {children}

      {/* Global loading overlay */}
      {showGlobalLoader && globalLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <DefaultLoader
            fullScreen={true}
            text={defaultLoadingText}
            variant="spinner"
            center={true}
          />
        </div>
      )}

      {/* Error overlay for global errors */}
      {error && globalLoading && (
        <div className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card border border-border rounded-lg p-8 max-w-md mx-4 text-center">
            <div className="text-destructive text-xl font-medium mb-4">
              Error
            </div>
            <p className="text-muted-foreground mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setError(null)}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setError(null);
                  setGlobalLoading(false);
                }}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
};

// Hook to use the loading context
export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};

// Custom hook for component-specific loading
export const useComponentLoading = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startLoading = useCallback(() => {
    setLoading(true);
    setError(null);
  }, []);

  const stopLoading = useCallback(() => {
    setLoading(false);
  }, []);

  const setLoadingError = useCallback((errorMessage: string) => {
    setLoading(false);
    setError(errorMessage);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  return {
    loading,
    error,
    startLoading,
    stopLoading,
    setLoadingError,
    clearError,
    reset,
  };
};

export default LoadingProvider;
