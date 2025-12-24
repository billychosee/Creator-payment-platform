import React, { useState } from "react";
import {
  DefaultLoader,
  CardSkeleton,
  TableSkeleton,
  FormSkeleton,
} from "@/components/ui/DefaultLoader";
import { withLoading, useApiWithLoading } from "@/components/ui/withLoading";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { api } from "@/lib/api";

/**
 * Example component showing different ways to use the DefaultLoader system
 * This serves as a template for backend developers
 */

// Example 1: Basic loading state with manual API call
const BasicLoadingExample = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call - replace with your actual API call
      const response = await api.getCurrentUser();
      if (response.success) {
        setData(response.data);
      } else {
        setError(response.error || "Failed to fetch data");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Loading Example</h3>
        <DefaultLoader text="Fetching user data..." size="md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Loading Example</h3>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
          <Button onClick={fetchData} variant="outline" className="mt-2">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Basic Loading Example</h3>
      {data ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">Data loaded successfully!</p>
          <pre className="text-sm mt-2">{JSON.stringify(data, null, 2)}</pre>
        </div>
      ) : (
        <Button onClick={fetchData}>Fetch Data</Button>
      )}
    </div>
  );
};

// Example 2: Using pre-built skeletons
const SkeletonLoadingExample = () => {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<any>(null);

  const loadContent = async () => {
    setLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setContent({ message: "Content loaded!" });
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Skeleton Loading Example</h3>

      {loading ? (
        <CardSkeleton />
      ) : content ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">{content.message}</p>
        </div>
      ) : (
        <Button onClick={loadContent}>Load Content</Button>
      )}
    </div>
  );
};

// Example 3: Using useApiWithLoading hook
const HookLoadingExample = () => {
  const { loading, error, executeWithLoading, clearError } =
    useApiWithLoading();
  const [result, setResult] = useState<any>(null);

  const handleApiCall = async () => {
    const data = await executeWithLoading(() => api.getTransactions());
    if (data) {
      setResult(data);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Hook Loading Example</h3>

      {loading ? (
        <DefaultLoader variant="dots" text="Loading transactions..." />
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
          <Button onClick={clearError} variant="outline" className="mt-2">
            Clear Error
          </Button>
        </div>
      ) : result ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">
            Loaded {Array.isArray(result) ? result.length : 0} transactions
          </p>
          <pre className="text-sm mt-2 max-h-40 overflow-y-auto">
            {Array.isArray(result)
              ? JSON.stringify(result.slice(0, 3), null, 2)
              : JSON.stringify(result, null, 2)}
          </pre>
        </div>
      ) : (
        <Button onClick={handleApiCall}>Load Transactions</Button>
      )}
    </div>
  );
};

// Example 4: Table loading with skeleton
const TableLoadingExample = () => {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);

  const loadTransactions = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setTransactions([
      { id: 1, amount: 100, type: "payment", status: "completed" },
      { id: 2, amount: 250, type: "donation", status: "pending" },
      { id: 3, amount: 75, type: "payment", status: "completed" },
    ]);
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Table Loading Example</h3>

      {loading ? (
        <TableSkeleton rows={5} columns={4} />
      ) : transactions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${transaction.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        transaction.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Button onClick={loadTransactions}>Load Transactions</Button>
      )}
    </div>
  );
};

// Example 5: Form loading with skeleton
const FormLoadingExample = () => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Form Loading Example</h3>

      {submitted ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">Form submitted successfully!</p>
          <Button
            onClick={() => setSubmitted(false)}
            variant="outline"
            className="mt-2"
          >
            Submit Another
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter your name"
            disabled={submitting}
            required
          />

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="Enter your email"
            disabled={submitting}
            required
          />

          <Button
            type="submit"
            isLoading={submitting}
            disabled={submitting}
            className="w-full"
          >
            {submitting ? "Submitting..." : "Submit Form"}
          </Button>
        </form>
      )}
    </div>
  );
};

// Example 6: Component wrapped with withLoading HOC
const UserProfileComponent = ({
  userId,
  loading,
  error,
  executeWithLoading,
  clearError,
}: any) => {
  const [user, setUser] = useState<any>(null);

  const loadUser = async () => {
    const userData = await executeWithLoading(() => api.getCurrentUser(), {
      onSuccess: (data: any) => {
        setUser(data);
      },
      onError: (error: string) => {
        console.error("Failed to load user:", error);
      },
    });
  };

  React.useEffect(() => {
    if (userId && !user) {
      loadUser();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">HOC Loading Example</h3>
        <DefaultLoader text="Loading user profile..." size="md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">HOC Loading Example</h3>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
          <Button onClick={clearError} variant="outline" className="mt-2">
            Clear Error
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">HOC Loading Example</h3>
      {user ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">User: {user.username || user.email}</p>
          <p className="text-green-600">{user.tagline}</p>
        </div>
      ) : (
        <Button onClick={loadUser}>Load User Profile</Button>
      )}
    </div>
  );
};

// Wrap the component with loading HOC
const EnhancedUserProfile = withLoading(UserProfileComponent, {
  loadingText: "Loading user profile...",
  fullScreen: false,
});

// Main example component
const DefaultLoaderExample = () => {
  const [activeExample, setActiveExample] = useState("basic");

  const examples = [
    { id: "basic", label: "Basic Loading", component: BasicLoadingExample },
    {
      id: "skeleton",
      label: "Skeleton Loading",
      component: SkeletonLoadingExample,
    },
    { id: "hook", label: "Hook Loading", component: HookLoadingExample },
    { id: "table", label: "Table Loading", component: TableLoadingExample },
    { id: "form", label: "Form Loading", component: FormLoadingExample },
    { id: "hoc", label: "HOC Loading", component: EnhancedUserProfile },
  ];

  const ActiveComponent =
    examples.find((ex) => ex.id === activeExample)?.component ||
    BasicLoadingExample;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Default Loader Examples
        </h1>
        <p className="text-gray-600">
          This component demonstrates different ways to use the DefaultLoader
          system for API operations. Perfect template for backend developers!
        </p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {examples.map((example) => (
          <Button
            key={example.id}
            variant={activeExample === example.id ? "primary" : "outline"}
            onClick={() => setActiveExample(example.id)}
          >
            {example.label}
          </Button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <ActiveComponent />
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-green-900 mb-2">
          Integration Tips
        </h3>
        <ul className="text-green-800 space-y-1 text-sm">
          <li>• Replace API calls with your actual backend endpoints</li>
          <li>
            • Customize loading text and variants to match your application
          </li>
          <li>• Use appropriate skeleton components for your content types</li>
          <li>• Handle both loading and error states consistently</li>
          <li>• Test with slow networks to ensure good UX</li>
        </ul>
      </div>
    </div>
  );
};

export default DefaultLoaderExample;
