# Default Loader Integration Guide

## Overview

The Tese Portal loading system provides:

- DefaultLoader Component: Ready-to-use loading spinners and skeletons
- withLoading HOC: Automatic loading state management for components
- LoadingProvider: Global loading state management
- useApiWithLoading Hook: Easy API call wrapping with loading states
- Pre-built Skeletons: For cards, tables, forms, and more

## Quick Start

### 1. Basic DefaultLoader Usage

```tsx
import { DefaultLoader } from "@/components/ui/DefaultLoader";

<DefaultLoader />
<DefaultLoader text="Fetching user data..." />
<DefaultLoader fullScreen text="Loading application..." />
<DefaultLoader variant="skeleton" text="Loading content..." />
<DefaultLoader variant="dots" text="Processing..." />
```

### 2. Using Pre-built Skeletons

```tsx
import { CardSkeleton, TableSkeleton, FormSkeleton } from "@/components/ui/DefaultLoader";

{isLoading ? <CardSkeleton /> : <YourCardContent />}
{isLoading ? <TableSkeleton rows={5} columns={4} /> : <YourTable />}
{isLoading ? <FormSkeleton /> : <YourForm />}
```

### 3. withLoading HOC

```tsx
import { withLoading } from "@/components/ui/withLoading";

const EnhancedUserProfile = withLoading(UserProfileComponent, {
  loadingText: "Loading user profile...",
  fullScreen: false,
});
```

### 4. useApiWithLoading Hook

```tsx
import { useApiWithLoading } from "@/components/ui/withLoading";

const { loading, error, executeWithLoading, clearError } = useApiWithLoading();

const user = await executeWithLoading(
  () => api.getCurrentUser(),
  {
    onSuccess: (userData) => console.log("User loaded:", userData),
    onError: (error) => console.error("Failed to load user:", error)
  }
);
```

### 5. LoadingProvider

```tsx
import { LoadingProvider } from "@/components/ui/LoadingProvider";

<LoadingProvider defaultLoadingText="Loading application...">
  <YourAppContent />
</LoadingProvider>
```

## Integration Examples

### Simple API Integration

```tsx
import { DefaultLoader } from "@/components/ui/DefaultLoader";
import { api } from "@/lib/api";

const SimpleAPICall = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.getCurrentUser();
      if (response.success) {
        setData(response.data);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <DefaultLoader text="Loading data..." />;
  if (error) return <div>Error: {error} <button onClick={fetchData}>Retry</button></div>;
  
  return (
    <div>
      {data ? <div>Data: {JSON.stringify(data)}</div> : <button onClick={fetchData}>Fetch Data</button>}
    </div>
  );
};
```

### Form with Loading States

```tsx
import { DefaultLoader, FormSkeleton } from "@/components/ui/DefaultLoader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { api } from "@/lib/api";

const UserRegistrationForm = () => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const response = await api.createUser(formData);
      if (response.success) {
        console.log("User created successfully");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) return <FormSkeleton />;
  
  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        disabled={submitting}
      />
      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        disabled={submitting}
      />
      <Button type="submit" isLoading={submitting}>
        {submitting ? "Creating User..." : "Create User"}
      </Button>
    </form>
  );
};
```

### Data Table with Loading

```tsx
import { TableSkeleton } from "@/components/ui/DefaultLoader";
import { api } from "@/lib/api";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.getTransactions();
        if (response.success) {
          setUsers(response.data || []);
        } else {
          setError(response.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  if (loading) return <TableSkeleton rows={10} columns={4} />;
  if (error) return <div>Error loading users: {error}</div>;
  
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Amount</th>
          <th>Type</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.amount}</td>
            <td>{user.type}</td>
            <td>{user.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```

### Using withLoading HOC

```tsx
import { withLoading } from "@/components/ui/withLoading";
import { api } from "@/lib/api";

const UserProfile = ({ userId, loading, error, executeWithLoading, clearError }) => {
  const [user, setUser] = React.useState(null);
  
  const loadUser = async () => {
    const userData = await executeWithLoading(
      () => api.getUserById(userId),
      {
        onSuccess: (data) => setUser(data),
        onError: (error) => console.error("Failed to load user:", error)
      }
    );
  };
  
  React.useEffect(() => {
    if (userId && !user) {
      loadUser();
    }
  }, [userId]);
  
  if (loading) return <div>Loading user profile...</div>;
  if (error) return <div>Error: {error} <button onClick={clearError}>Clear Error</button></div>;
  if (!user) return <div>No user found</div>;
  
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <p>{user.tagline}</p>
    </div>
  );
};

const EnhancedUserProfile = withLoading(UserProfile, {
  loadingText: "Loading user profile...",
  fullScreen: false,
});

export default EnhancedUserProfile;
```

## Custom Backend Integration

### Configure API Provider

```env
NEXT_PUBLIC_API_PROVIDER=custom
NEXT_PUBLIC_API_URL=https://your-backend-api.com
NEXT_PUBLIC_API_KEY=your-api-key
```

### API Response Format

Ensure your backend API returns responses in this format:

```json
{
  "success": true,
  "data": { /* your response data */ },
  "message": "Operation completed successfully"
}
```

Or for errors:

```json
{
  "success": false,
  "error": "Error message describing what went wrong",
  "message": "Additional context message"
}
```

## Best Practices

### 1. Consistent Loading States
- Provide meaningful loading text
- Use appropriate skeleton components for content
- Handle both loading and error states

### 2. User Experience
- Show loading states for operations longer than 300ms
- Provide clear error messages
- Allow users to retry failed operations

### 3. Performance
- Use skeleton components to prevent layout shifts
- Implement proper loading states for API calls
- Cache data when appropriate

### 4. Accessibility
- Ensure loading indicators are accessible
- Provide proper ARIA labels
- Support reduced motion preferences

## Troubleshooting

### Common Issues

1. **Loading state not showing**: Check if your API call is properly wrapped with loading functions
2. **Type errors**: Ensure your API responses match the `APIResponse<T>` interface
3. **Custom components not working**: Verify that custom loading components receive the correct props

The default loader system is designed to be flexible and work with any backend API that returns responses in the expected format. Start with the basic `DefaultLoader` component and gradually add more advanced features as needed.
