# Component Documentation

## 🎨 UI Components

### Button

Location: `src/components/ui/Button.tsx`

**Props:**

- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
- `size`: 'sm' | 'md' | 'lg'
- `isLoading`: boolean
- `disabled`: boolean

**Usage:**

```tsx
<Button variant="primary" size="lg" isLoading={false}>
  Click Me
</Button>
```

---

### Input

Location: `src/components/ui/Input.tsx`

**Props:**

- `label`: string (optional)
- `error`: string (optional)
- `helperText`: string (optional)
- Standard HTML input attributes

**Usage:**

```tsx
<Input
  label="Email"
  type="email"
  placeholder="you@example.com"
  error={errors.email}
  helperText="We'll never share your email"
/>
```

---

### Textarea

Location: `src/components/ui/Textarea.tsx`

**Props:**

- `label`: string (optional)
- `error`: string (optional)
- `helperText`: string (optional)
- Standard HTML textarea attributes

**Usage:**

```tsx
<Textarea label="Bio" placeholder="Tell us about yourself..." rows={4} />
```

---

### Card

Location: `src/components/ui/Card.tsx`

Components: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`

**Usage:**

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content goes here</CardContent>
  <CardFooter>Footer content</CardFooter>
</Card>
```

---

### Modal

Location: `src/components/ui/Modal.tsx`

**Props:**

- `isOpen`: boolean
- `onClose`: () => void
- `title`: string (optional)
- `size`: 'sm' | 'md' | 'lg'
- `children`: ReactNode

**Usage:**

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  size="md"
>
  Modal content
</Modal>
```

---

### Toast

Location: `src/components/ui/Toast.tsx`

**Hook Usage:**

```tsx
const { toasts, showToast, removeToast } = useToast();

// Show toast
showToast("Success!", "success");
showToast("Error occurred", "error");
showToast("Info message", "info");
showToast("Warning!", "warning");

// In JSX
<ToastContainer toasts={toasts} onClose={removeToast} />;
```

---

### Skeleton

Location: `src/components/ui/Skeleton.tsx`

**Usage:**

```tsx
<Skeleton count={3} /> {/* 3 skeleton lines */}
```

---

### Select

Location: `src/components/ui/Select.tsx`

**Props:**

- `label`: string (optional)
- `error`: string (optional)
- `options`: { value: string; label: string }[]

**Usage:**

```tsx
<Select
  label="Choose"
  options={[
    { value: "1", label: "Option 1" },
    { value: "2", label: "Option 2" },
  ]}
/>
```

---

## 🏗️ Layout Components

### DashboardLayout

Location: `src/components/shared/DashboardLayout.tsx`

Wraps all dashboard pages. Includes sidebar and navbar.

**Usage:**

```tsx
<DashboardLayout>
  <h1>Page Content</h1>
</DashboardLayout>
```

---

### Sidebar

Location: `src/components/shared/Sidebar.tsx`

Features:

- Responsive (collapses to hamburger on mobile)
- Navigation links
- Logo
- Logout button

---

### Navbar

Location: `src/components/shared/Navbar.tsx`

Features:

- Notifications bell
- Dark/Light mode toggle
- User profile preview
- Fixed positioning

---

## 📊 Feature Components

### StatCard

Location: `src/components/cards/StatCard.tsx`

**Props:**

- `title`: string
- `value`: string | number
- `icon`: LucideIcon
- `trend`: { value: number; isPositive: boolean } (optional)
- `subtext`: string (optional)

**Usage:**

```tsx
import { DollarSign } from "lucide-react";

<StatCard
  title="Total Earnings"
  value="$2,450.00"
  icon={DollarSign}
  trend={{ value: 12, isPositive: true }}
  subtext="All time"
/>;
```

---

### OverviewCard

Location: `src/components/cards/StatCard.tsx`

**Props:**

- `title`: string
- `value`: string | number
- `isCurrency`: boolean (default: true)

**Usage:**

```tsx
<OverviewCard title="Today's Earnings" value={150} isCurrency={true} />
```

---

## 📋 Table Components

### TransactionTable

Location: `src/components/tables/TransactionTable.tsx`

**Props:**

- `transactions`: Transaction[]
- `isLoading`: boolean (optional)

**Features:**

- Search by description, username, or ID
- Filter by transaction type
- Pagination
- Status badges
- Export CSV button

**Usage:**

```tsx
import { TransactionTable } from "@/components/tables/TransactionTable";
import { MOCK_TRANSACTIONS } from "@/services/mock";

<TransactionTable transactions={MOCK_TRANSACTIONS} />;
```

---

### PayoutTable

Location: `src/components/tables/PayoutTable.tsx`

**Props:**

- `payouts`: Payout[]
- `isLoading`: boolean (optional)

**Features:**

- Shows amount, method, status
- Date formatting
- Status color coding

**Usage:**

```tsx
import { PayoutTable } from "@/components/tables/PayoutTable";
import { MOCK_PAYOUTS } from "@/services/mock";

<PayoutTable payouts={MOCK_PAYOUTS} />;
```

---

## 📝 Form Components

### SignupForm

Location: `src/components/forms/SignupForm.tsx`

3-step signup:

1. Basic info (username, tagline)
2. Social links (optional)
3. Account (email, password)

**Props:**

- `onSkip`: () => void (optional)

**Usage:**

```tsx
<SignupForm onSkip={() => router.push("/dashboard")} />
```

---

### ProfileForm

Location: `src/components/forms/ProfileForm.tsx`

Edit creator profile with:

- Username
- Tagline
- Bio
- Social links
- Profile picture upload

**Usage:**

```tsx
<ProfileForm />
```

---

### PaymentLinkForm

Location: `src/components/forms/PaymentLinkForm.tsx`

Generate payment links with:

- Amount (optional)
- Description
- Link preview
- Copy to clipboard

**Usage:**

```tsx
<PaymentLinkForm />
```

---

### PaymentRequestForm

Location: `src/components/forms/PaymentRequestForm.tsx`

Request payment with:

- Recipient email
- Amount
- Reason

**Usage:**

```tsx
<PaymentRequestForm />
```

---

## 🎨 Theme System

### ThemeProvider

Location: `src/app/layout/ThemeProvider.tsx`

Context-based theme management:

- Light/Dark mode toggle
- System preference detection
- LocalStorage persistence

**Hook Usage:**

```tsx
import { useTheme } from "@/app/layout/ThemeProvider";

export function MyComponent() {
  const { theme, toggleTheme } = useTheme();

  return <button onClick={toggleTheme}>Current: {theme}</button>;
}
```

---

## 🔧 Utility Functions

Location: `src/lib/utils.ts`

### cn()

Merges Tailwind classes with conflict resolution.

```tsx
cn("px-2 py-1", "px-3 py-2"); // Returns 'px-3 py-2'
```

### formatCurrency()

Formats number as USD currency.

```tsx
formatCurrency(2450); // Returns "$2,450.00"
```

### formatDate()

Formats date to readable string.

```tsx
formatDate(new Date()); // Returns "Nov 15, 2024"
```

### formatDateWithTime()

Formats date with time.

```tsx
formatDateWithTime(new Date()); // Returns "Nov 15, 2024 02:30 PM"
```

---

## 📦 Types

Location: `src/types/index.ts`

```typescript
interface User {
  id: string;
  username: string;
  email: string;
  tagline?: string;
  bio?: string;
  profileImage?: string;
  socialLinks?: SocialLinks;
  createdAt: Date;
}

interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: "donation" | "payment_link" | "payment_request";
  status: "completed" | "pending" | "failed";
  description?: string;
  createdAt: Date;
  fromUser?: { username: string; profileImage?: string };
}

interface Payout {
  id: string;
  userId: string;
  amount: number;
  status: "pending" | "processing" | "completed" | "failed";
  method: "bank_transfer" | "paypal" | "stripe";
  createdAt: Date;
  completedAt?: Date;
}

// ... more types
```

---

## 🎯 Common Patterns

### Using a Form with Toast Notifications

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";

export function MyForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Do something
      showToast("Success!", "success");
    } catch (error) {
      showToast("Error occurred", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Input label="Name" />
      <Button onClick={handleSubmit} isLoading={isLoading}>
        Submit
      </Button>
    </>
  );
}
```

### Responsive Grid Layout

```tsx
<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{/* Content */}</div>
```

### Card with Action Button

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">{/* Content */}</CardContent>
  <CardFooter>
    <Button className="w-full">Action</Button>
  </CardFooter>
</Card>
```

---

## 🚀 Tips & Best Practices

1. **Always wrap dashboard pages** with `DashboardLayout`
2. **Use `cn()`** for conditional Tailwind classes
3. **Use `formatCurrency()`** for money values
4. **Use `Skeleton`** for loading states
5. **Use `useToast()`** for user feedback
6. **Group related inputs** with `space-y-4`
7. **Use `animate-fade-in`** for page transitions
8. **Use relative imports** with `@/` alias

---

For more information, check individual component files for JSDoc comments and examples.

