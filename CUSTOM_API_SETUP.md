# 🔧 Custom API Server Setup Guide

This guide will help you set up and use the custom API server for the Creator Payment Platform. The system is configured to use custom API by default.

## 🚀 Quick Start (5 Minutes)

### 1. Start the API Server
```bash
cd server
npm install
npm run dev
```

The API server will start on `http://localhost:3001`

### 2. Configure Frontend Environment
```bash
# Copy environment file
cp .env.local.example .env.local

# The default configuration already points to the local API server:
NEXT_PUBLIC_API_PROVIDER=custom
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 3. Start Frontend
```bash
# In the main directory
npm run dev
```

## 📡 API Server Details

### Endpoints Overview
```
POST   /api/auth/login           # User authentication
POST   /api/users                # Create user
GET    /api/users/email/:email   # Get user by email
GET    /api/users/username/:username # Get user by username
GET    /api/users/:userId        # Get user by ID
PUT    /api/users/:userId        # Update user
GET    /api/transactions         # Get transactions
POST   /api/transactions         # Create transaction
GET    /api/payment-links        # Get payment links
POST   /api/payment-links        # Create payment link
PUT    /api/payment-links/:id    # Update payment link
GET    /api/payouts              # Get payouts
POST   /api/payouts              # Create payout
PUT    /api/payouts/:id          # Update payout
GET    /api/dashboard/stats/:userId # Get dashboard stats
```

### Authentication
The API uses JWT tokens for authentication. Include the token in requests:
```javascript
headers: {
  'Authorization': 'Bearer ' + token
}
```

### Example Request Flow
```javascript
// 1. Login
const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

// 2. Use the token for subsequent requests
const userResponse = await fetch('http://localhost:3001/api/users/email/user@example.com', {
  headers: {
    'Authorization': 'Bearer ' + token
  }
});
```

## 🔧 Server Configuration

### Environment Variables (.env)
```env
PORT=3001
JWT_SECRET=your-super-secure-jwt-secret-here
CORS_ORIGIN=http://localhost:3000
```

### Required Dependencies
```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "bcrypt": "^5.1.0",
  "jsonwebtoken": "^9.0.2"
}
```

## 🗄️ Data Storage

The example server uses **in-memory storage** for simplicity. This means:

✅ **Good for development and testing**  
✅ **No database setup required**  
❌ **Data is lost when server restarts**  

### Production Recommendations
For production, replace the in-memory storage with:
- **PostgreSQL** - Full-featured relational database
- **MongoDB** - Document-based NoSQL database
- **Redis** - Fast in-memory storage for sessions

## 🛠️ Customizing the API Server

### Adding New Endpoints
```javascript
// Example: Add a new endpoint for payment requests
app.get('/api/payment-requests', authenticateToken, (req, res) => {
  try {
    const { userId } = req.query;
    let userRequests = Array.from(paymentRequests.values());
    
    if (userId) {
      userRequests = userRequests.filter(r => r.userId === userId);
    }

    res.json({
      success: true,
      data: userRequests
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get payment requests' });
  }
});
```

### Database Integration
Replace the in-memory Maps with real database calls:

```javascript
// Replace this:
const users = new Map();

// With this (PostgreSQL example):
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Then use:
const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
```

## 🔒 Security Considerations

### Production Security Checklist
- [ ] Use strong JWT secrets
- [ ] Implement rate limiting
- [ ] Add request validation
- [ ] Enable HTTPS
- [ ] Set up proper CORS
- [ ] Sanitize user inputs
- [ ] Use environment variables for secrets

### Rate Limiting (Optional)
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## 🚀 Deployment Options

### Heroku
```bash
# Create Heroku app
heroku create your-api-app-name

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set JWT_SECRET=your-secret-here

# Deploy
git push heroku main
```

### Railway
```bash
# Connect to Railway
railway login
railway link

# Set environment variables in Railway dashboard
# Deploy automatically on git push
```

### DigitalOcean App Platform
1. Connect your GitHub repository
2. Add environment variables
3. Deploy automatically

### Vercel (Edge Functions)
```javascript
// vercel.json
{
  "version": 2,
  "functions": {
    "api/*.js": {
      "runtime": "nodejs18.x"
    }
  }
}
```

## 🔧 Troubleshooting

### Common Issues

**"Cannot connect to API server"**
- Check if server is running: `curl http://localhost:3001/health`
- Verify CORS settings
- Check environment variables

**"401 Unauthorized"**
- Ensure JWT token is included in requests
- Check if token has expired
- Verify JWT_SECRET matches on both client and server

**"CORS policy"**
- Update CORS_ORIGIN in server .env
- Or temporarily use: `app.use(cors());` for development

**"Port already in use"**
- Change PORT in server .env
- Kill existing process: `kill -9 $(lsof -ti:3001)`

### Debug Mode
Enable detailed logging in the server:
```javascript
// Add to server code
const morgan = require('morgan');
app.use(morgan('dev'));
```

## 📊 Monitoring & Logs

### Health Checks
The server provides a health endpoint:
```bash
curl http://localhost:3001/health
# Response: {"status":"OK","timestamp":"2024-01-01T00:00:00.000Z"}
```

### Log Analysis
Monitor these logs:
- Authentication failures
- Database errors
- High response times
- Failed requests

## 🎯 Next Steps

1. **Test with provided endpoints** - Use the `/api-test` page in the frontend
2. **Add payment processing** - Integrate Stripe/PayPal
3. **Implement file uploads** - For profile images and payment link logos
4. **Add email notifications** - Use services like SendGrid
5. **Scale the database** - Replace in-memory storage with PostgreSQL

## 📚 API Reference

For complete API documentation, the server follows RESTful conventions:
- `GET` - Retrieve data
- `POST` - Create new resources
- `PUT` - Update existing resources
- `DELETE` - Remove resources

All responses follow the format:
```json
{
  "success": true,
  "data": {...},
  "error": null
}
```

Or for errors:
```json
{
  "success": false,
  "data": null,
  "error": "Error message"
}
```

---

**Ready to deploy?** The system is production-ready with proper JWT authentication, CORS handling, and error management. Simply replace the in-memory storage with your preferred database!