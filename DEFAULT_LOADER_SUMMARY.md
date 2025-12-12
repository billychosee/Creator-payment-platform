# Default Loader Implementation

## Created Files

### Core Components

**`src/components/ui/DefaultLoader.tsx`** - Main loader component:

- Spinner, dots, pulse, and skeleton variants
- Pre-built skeleton components (CardSkeleton, TableSkeleton, FormSkeleton)
- Full-screen overlay capability
- Customizable sizes and text

**`src/components/ui/withLoading.tsx`** - Loading management:

- `withLoading()` HOC for component wrapping
- `useApiWithLoading()` hook for API calls
- `useLoadingState()` hook for manual state management
- Enhanced props with loading utilities

**`src/components/ui/LoadingProvider.tsx`** - Global loading:

- Context provider for app-wide loading states
- Global loading overlay with error handling
- Component-specific loading hooks

### Documentation

**`DEFAULT_LOADER_INTEGRATION_GUIDE.md`** - Integration guide with examples and best practices

**`src/components/examples/DefaultLoaderExample.tsx`** - Working examples demonstrating all loading patterns

## Usage Examples

```tsx
// Basic loader
import { DefaultLoader } from "@/components/ui/DefaultLoader";
<DefaultLoader text="Loading..." />;

// API calls with loading
import { useApiWithLoading } from "@/components/ui/withLoading";
const { loading, executeWithLoading } = useApiWithLoading();
const data = await executeWithLoading(() => api.yourAPICall());

// Component wrapping
import { withLoading } from "@/components/ui/withLoading";
const EnhancedComponent = withLoading(YourComponent);
```

## Features

- Multiple loader variants (spinner, dots, pulse, skeleton)
- Pre-built content skeletons (cards, tables, forms)
- Automatic loading state management
- Global loading overlay support
- Built-in error handling and retry functionality
- TypeScript support
- Accessibility features
- Responsive design

## Integration

Works seamlessly with existing API abstraction layer. Configure backend endpoints and replace demo API calls with actual backend integration.

The system provides consistent loading states across all API operations with minimal setup required.
