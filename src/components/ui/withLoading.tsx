import React, { ComponentType, useState, useCallback } from "react";
import { DefaultLoader } from "@/components/ui/DefaultLoader";
import { APIResponse } from "@/lib/api";

interface WithLoadingOptions {
  fullScreen?: boolean;
  loadingText?: string;
  loadingVariant?: "spinner" | "dots" | "pulse";
  skipLoading?: boolean;
  loadingComponent?: React.ComponentType<any>;
}

/**
 * Higher-Order Component that adds loading state management to any component
 * Perfect for wrapping components that make API calls
 */
export function withLoading<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithLoadingOptions = {}
) {
  const {
    fullScreen = false,
    loadingText = "Loading...",
    loadingVariant = "spinner",
    skipLoading = false,
    loadingComponent: CustomLoadingComponent,
  } = options;

  const WithLoadingComponent: React.FC<P> = (props) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Enhanced execute function that handles loading states automatically
    const executeWithLoading = useCallback(
      async <T,>(
        apiCall: () => Promise<APIResponse<T>>,
        onSuccess?: (data: T) => void,
        onError?: (error: string) => void
      ): Promise<T | null> => {
        if (skipLoading) {
          try {
            const response = await apiCall();
            if (response.success && response.data) {
              onSuccess?.(response.data);
              return response.data;
            } else {
              const errorMessage = response.error || "An error occurred";
              setError(errorMessage);
              onError?.(errorMessage);
              return null;
            }
          } catch (err) {
            const errorMessage =
              err instanceof Error
                ? err.message
                : "An unexpected error occurred";
            setError(errorMessage);
            onError?.(errorMessage);
            return null;
          }
        }

        setLoading(true);
        setError(null);

        try {
          const response = await apiCall();

          if (response.success && response.data) {
            onSuccess?.(response.data);
            return response.data;
          } else {
            const errorMessage = response.error || "An error occurred";
            setError(errorMessage);
            onError?.(errorMessage);
            return null;
          }
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "An unexpected error occurred";
          setError(errorMessage);
          onError?.(errorMessage);
          return null;
        } finally {
          setLoading(false);
        }
      },
      [skipLoading]
    );

    // Enhanced execute function for direct API calls (non-wrapped responses)
    const executeWithLoadingDirect = useCallback(
      async <T,>(
        apiCall: () => Promise<T>,
        onSuccess?: (data: T) => void,
        onError?: (error: string) => void
      ): Promise<T | null> => {
        if (skipLoading) {
          try {
            const result = await apiCall();
            onSuccess?.(result);
            return result;
          } catch (err) {
            const errorMessage =
              err instanceof Error
                ? err.message
                : "An unexpected error occurred";
            setError(errorMessage);
            onError?.(errorMessage);
            return null;
          }
        }

        setLoading(true);
        setError(null);

        try {
          const result = await apiCall();
          onSuccess?.(result);
          return result;
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "An unexpected error occurred";
          setError(errorMessage);
          onError?.(errorMessage);
          return null;
        } finally {
          setLoading(false);
        }
      },
      [skipLoading]
    );

    // Clear error function
    const clearError = useCallback(() => {
      setError(null);
    }, []);

    // Loading state control functions
    const startLoading = useCallback(() => {
      setLoading(true);
      setError(null);
    }, []);

    const stopLoading = useCallback(() => {
      setLoading(false);
    }, []);

    // Show loading state
    if (loading) {
      if (CustomLoadingComponent) {
        return React.createElement(CustomLoadingComponent, {
          ...props,
          loading,
          error,
          executeWithLoading,
          executeWithLoadingDirect,
          clearError,
          startLoading,
          stopLoading,
          setError,
        });
      }

      return (
        <DefaultLoader
          fullScreen={fullScreen}
          text={loadingText}
          variant={loadingVariant}
          center={!fullScreen}
        />
      );
    }

    // Show error state if there's an error and not fullScreen
    if (error && !fullScreen) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4 p-8">
          <div className="text-center">
            <div className="text-destructive text-lg font-medium mb-2">
              Error
            </div>
            <p className="text-muted-foreground mb-4">{error}</p>
            <button
              onClick={clearError}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    // Create enhanced props
    const enhancedProps = {
      ...props,
      loading,
      error,
      executeWithLoading,
      executeWithLoadingDirect,
      clearError,
      startLoading,
      stopLoading,
      setError,
    };

    // Render the wrapped component with enhanced props
    return React.createElement(WrappedComponent, enhancedProps);
  };

  WithLoadingComponent.displayName = `withLoading(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;

  return WithLoadingComponent;
}

// Hook for manual loading state management
export function useLoadingState(initialState = false) {
  const [loading, setLoading] = useState(initialState);
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
}

// Hook for wrapping API calls with loading states
export function useApiWithLoading() {
  const {
    loading,
    error,
    startLoading,
    stopLoading,
    setLoadingError,
    clearError,
  } = useLoadingState();

  const executeWithLoading = useCallback(
    async <T,>(
      apiCall: () => Promise<APIResponse<T>>,
      onSuccess?: (data: T) => void,
      onError?: (error: string) => void
    ): Promise<T | null> => {
      startLoading();

      try {
        const response = await apiCall();

        if (response.success && response.data) {
          onSuccess?.(response.data);
          return response.data;
        } else {
          const errorMessage = response.error || "An error occurred";
          setLoadingError(errorMessage);
          onError?.(errorMessage);
          return null;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setLoadingError(errorMessage);
        onError?.(errorMessage);
        return null;
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading, setLoadingError]
  );

  const executeWithLoadingDirect = useCallback(
    async <T,>(
      apiCall: () => Promise<T>,
      onSuccess?: (data: T) => void,
      onError?: (error: string) => void
    ): Promise<T | null> => {
      startLoading();

      try {
        const result = await apiCall();
        onSuccess?.(result);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setLoadingError(errorMessage);
        onError?.(errorMessage);
        return null;
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading, setLoadingError]
  );

  return {
    loading,
    error,
    executeWithLoading,
    executeWithLoadingDirect,
    clearError,
  };
}

export default withLoading;
