# API Configuration Guide

Configure backend integration for the Tese Portal frontend. The system supports multiple providers with simple environment variable configuration.

## Quick Start

Default Setting: The app works out-of-the-box with localStorage - no setup required.

```bash
npm run dev
```

Data is stored in browser localStorage for development and testing.

## Switching to Real APIs

Choose your preferred backend provider and follow the setup steps:

---

## Option 1: Supabase

Recommended for rapid development with built-in authentication and database.

### Step 1: Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Sign up with GitHub, Google, or email
3. Create a new project (free tier available)

### Step 2: Get Credentials

1. In your Supabase dashboard, go to Settings → API
2. Copy these values:
   - Project URL (looks like `https://xxxxx.supabase.co`)
   - anon/public key (starts with `eyJ`)

### Step 3: Setup Database

1. Go to SQL Editor in Supabase dashboard
2. Copy and paste the entire contents of `supabase-schema.sql`
3. Click Run to create all tables and security policies

### Step 4: Configure Environment

Copy `.env.local.example` to `.env.local` and update:

```env
# Switch to Supabase
NEXT_PUBLIC_API_PROVIDER=supabase
NEXT_PUBLIC_API_ENABLED=true

# Add your Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 5: Restart and Test

```bash
npm run dev
```

Your app now uses Supabase! Data persists across browser sessions and devices.

---

## Option 2: Custom API

Use when you have your own backend API server.

### Step 1: API Server Setup

Your API should expose these endpoints:

```javascript
// Required endpoints:
POST   /api/users              // Create user
GET    /api/users/email/:email // Get user by email
GET    /api/users/username/:username // Get user by username
PUT    /api/users/:id          // Update user
POST   /api/auth/login         // Login user
GET    /api/transactions       // Get transactions
POST   /api/transactions       // Create transaction
// ... (see src/lib/api.ts for full API contract)
```

### Step 2: Configure Environment

```env
# Switch to custom API
NEXT_PUBLIC_API_PROVIDER=custom
NEXT_PUBLIC_API_ENABLED=true

# Add your API credentials
NEXT_PUBLIC_API_URL=https://your-api.com/api
NEXT_PUBLIC_API_KEY=your-api-key-here
```

### Step 3: Test Your API

```bash
npm run dev
```

---

## Environment Variables Reference

| Variable                        | Description          | Values                                       | Required      |
| ------------------------------- | -------------------- | -------------------------------------------- | ------------- |
| `NEXT_PUBLIC_API_PROVIDER`      | Backend provider     | `localStorage`, `supabase`, `custom`, `mock` | Yes           |
| `NEXT_PUBLIC_API_ENABLED`       | Enable/disable API   | `true`, `false`                              | No            |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL | `https://xxx.supabase.co`                    | Supabase only |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key    | `eyJ...`                                     | Supabase only |
| `NEXT_PUBLIC_API_URL`           | Custom API base URL  | `https://your-api.com/api`                   | Custom only   |
| `NEXT_PUBLIC_API_KEY`           | Custom API key       | Your API key                                 | Custom only   |

## Advanced Configuration

### Switching Between Providers

Change one line to switch providers:

```env
# For testing different providers:
NEXT_PUBLIC_API_PROVIDER=mock       # Use simulated API with delays
NEXT_PUBLIC_API_PROVIDER=localStorage # Use browser storage
NEXT_PUBLIC_API_PROVIDER=supabase    # Use Supabase
NEXT_PUBLIC_API_PROVIDER=custom      # Use your API
```

### Disabling API (Debug Mode)

```env
NEXT_PUBLIC_API_ENABLED=false
# Falls back to localStorage
```

### Development Settings

```env
# Enable debug logging
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_LOG_API_CALLS=true
```

## Testing Different Providers

### Mock API (For Testing)

Simulates real API behavior with delays:

```env
NEXT_PUBLIC_API_PROVIDER=mock
```

### LocalStorage (Default)

Uses browser localStorage, no external dependencies:

```env
NEXT_PUBLIC_API_PROVIDER=localStorage
```

## Troubleshooting

### Common Issues

**Issue: "Supabase configuration missing"**

- Solution: Check your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Issue: "API not initialized"**

- Solution: Ensure `NEXT_PUBLIC_API_ENABLED=true`

**Issue: "Custom API configuration missing"**

- Solution: Check your `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_API_KEY`

**Issue: "Authentication failed"**

- Solution: Verify your API credentials and endpoint URLs

### Getting Help

1. Check browser console for error messages
2. Ensure environment variables are correctly set
3. Verify API endpoints are accessible
4. Check network tab for failed requests

## Switching Back to localStorage

```env
NEXT_PUBLIC_API_PROVIDER=localStorage
```

Data will be stored in the browser again. Note: This won't merge with data from other providers.

## Checklist for Going Live

- [ ] Choose and configure your backend provider
- [ ] Set up proper error handling in your components
- [ ] Test authentication flow
- [ ] Verify data persistence across sessions
- [ ] Set up proper security (RLS for Supabase)
- [ ] Configure proper CORS if using custom API
- [ ] Add environment variables to your deployment

## Best Practices

1. Start with localStorage for development
2. Use Supabase for quick production deployment
3. Use Custom API only if you need specific functionality
4. Always test by switching providers
5. Keep API keys secure - never commit them to version control

---

For additional help, check the browser console for error messages when switching providers.
