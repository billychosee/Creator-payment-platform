# Tese - Next.js Frontend

Next.js 14 (App Router) frontend for Tese, a Creator/Influencer Payment Platform similar to "Buy Me a Coffee". Allows creators and influencers to monetize their influence by accepting payments from their community.

## Features

### Core Features

- Multi-step Signup - Easy onboarding for creators
- Beautiful Dashboard - Overview of earnings with real-time stats
- Payment Management - Create payment links and request payments
- Transaction Tracking - Complete transaction history with filtering
- Payout Management - Manage withdrawals and payout history
- Creator Profile - Showcase your profile and social links
- Settings - Control account preferences and security

### Tech Stack

- Next.js 14 (App Router)
- TypeScript - Type-safe development
- TailwindCSS - Modern styling
- Lucide React - Beautiful icons
- Recharts - Interactive charts
- Framer Motion - Smooth animations
- Axios - API calls

### Key Components

- Reusable UI Components - Button, Input, Card, Modal, Toast, Skeleton
- Form Components - Signup, Profile, Payment Link, Payment Request
- Table Components - Transaction and Payout tables with pagination
- Dashboard Layout - Responsive sidebar and navbar
- Theme System - Light/Dark mode toggle

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── globals.css             # Global styles
│   ├── layout/
│   │   └── ThemeProvider.tsx   # Dark/Light mode context
│   ├── page/
│   │   └── page.tsx            # Landing page
│   ├── signup/
│   │   └── page.tsx            # Multi-step signup
│   ├── dashboard/
│   │   └── page.tsx            # Main dashboard with chart
│   ├── payments/
│   │   ├── payment-link/       # Create payment links
│   │   ├── payment-request/    # Request payments
│   │   ├── payouts/            # Manage payouts
│   │   └── transactions/       # Transaction history
│   ├── profile/
│   │   └── page.tsx            # Creator profile
│   └── settings/
│       └── page.tsx            # Account settings
├── components/
│   ├── ui/                     # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Toast.tsx
│   │   ├── Skeleton.tsx
│   │   └── Select.tsx
│   ├── shared/                 # Layout components
│   │   ├── Sidebar.tsx
│   │   ├── Navbar.tsx
│   │   └── DashboardLayout.tsx
│   ├── cards/                  # Feature-specific cards
│   │   └── StatCard.tsx
│   ├── tables/                 # Data tables
│   │   ├── TransactionTable.tsx
│   │   └── PayoutTable.tsx
│   └── forms/                  # Form components
│       ├── SignupForm.tsx
│       ├── ProfileForm.tsx
│       ├── PaymentLinkForm.tsx
│       └── PaymentRequestForm.tsx
├── lib/
│   └── utils.ts                # Utility functions
├── services/
│   ├── api.ts                  # Axios API client
│   └── mock.ts                 # Mock data for development
├── types/
│   └── index.ts                # TypeScript types
└── hooks/                      # Custom hooks (if needed)
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Navigate to the project directory:

   ```bash
   cd tese
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open your browser:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Pages Overview

### Landing Page (`/`)

- Hero section with value proposition
- Feature highlights
- CTA buttons for signup

### Signup (`/signup`)

- 3-step signup process
- Step 1: Basic info (username, tagline)
- Step 2: Social links (optional)
- Step 3: Account creation (email, password)
- "I'll do it later" skip option

### Dashboard (`/dashboard`)

- 4 overview cards:
  - Total Earnings
  - Today's Earnings
  - Pending Payouts
  - Total Transactions
- Interactive line chart showing earnings over time
- Period selector (Daily, Weekly, Monthly, Yearly)
- Quick action cards for common tasks

### Payment Management

- **Payment Link** (`/payments/payment-link`) - Generate shareable links
- **Payment Request** (`/payments/payment-request`) - Request payments from others
- **Payouts** (`/payments/payouts`) - Manage withdrawals
- **Transactions** (`/payments/transactions`) - View all transactions with filtering

### Profile (`/profile`)

- View/edit creator profile
- Social media links
- Profile picture
- Bio and tagline
- Share profile button

### Settings (`/settings`)

- **General** - Account information
- **Notifications** - Notification preferences
- **Security** - Password and 2FA
- **API Keys** - API key management

## Theming

The app includes automatic light/dark mode support:

- Detects system preference on first load
- Persists user choice in localStorage
- Smooth theme transitions
- Click theme toggle in navbar

## Chart Component

The dashboard features a Recharts LineChart with:

- Dual Y-axis (earnings and transaction count)
- Interactive tooltips
- Legend
- Responsive container
- Period selector (Daily/Weekly/Monthly/Yearly)

## API Integration

All API calls use Axios with:

- Placeholder endpoints (ready to connect to real API)
- Mock data for development
- Bearer token authentication
- Error handling ready

### Mock Data Included

- User profile data
- Transaction history
- Payout records
- Chart data generation

## Forms & Validation

All forms include:

- Input validation
- Error messages
- Loading states
- Success feedback

## Responsive Design

- Mobile-first approach
- Responsive grid layouts
- Mobile sidebar with hamburger menu
- Tablet and desktop optimizations

## Security Features

- Password confirmation validation
- Protected routes ready
- Secure token storage
- CSRF protection ready

## Animations

- hover effects
- Fade-in page transitions
- Smooth card Slide-up modals
- Loading spinners
- Skeleton loaders

## Component Usage Examples

### Using StatCard

```tsx
<StatCard
  title="Total Earnings"
  value="$2,450.00"
  icon={DollarSign}
  trend={{ value: 12, isPositive: true }}
  subtext="All time"
/>
```

### Using TransactionTable

```tsx
<TransactionTable transactions={transactions} isLoading={false} />
```

### Using Button

```tsx
<Button variant="primary" size="lg" isLoading={false}>
  Create Account
</Button>
```

## Building & Deployment

### Build

```bash
npm run build
```

### Production Run

```bash
npm run start
```

### Linting

```bash
npm run lint
```

## Environment Setup

### Development

The app works out of the box with mock data. For API integration:

```env
NEXT_PUBLIC_API_URL=http://your-api-endpoint
```

### Production

```env
NEXT_PUBLIC_API_URL=https://api.yourproduction.com
```

## Next Steps

1. **Connect to Backend API**

   - Update API endpoints in `src/services/api.ts`
   - Replace mock data with real API calls

2. **Add Authentication**

   - Implement login/logout flows
   - Set up JWT token management
   - Add protected routes

3. **Integrate Payment Gateway**

   - Connect Stripe or PayPal
   - Implement payment processing
   - Handle webhooks

4. **Add Email Notifications**

   - Set up email service
   - Implement notification templates
   - Add email verification

5. **Database Integration**
   - Connect to your backend database
   - Implement real data persistence
   - Set up sync mechanisms

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS](https://tailwindcss.com)
- [Recharts](https://recharts.org)
- [Lucide Icons](https://lucide.dev)
- [TypeScript](https://www.typescriptlang.org)

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to submit issues and pull requests to improve the application.

## Support

For questions and support, please reach out to the team.
