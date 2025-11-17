// Example Custom API Server
// This is a complete Node.js/Express server that implements the required API endpoints
// for the Creator Payment Platform

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database (replace with real database in production)
const users = new Map();
const transactions = new Map();
const payouts = new Map();
const paymentLinks = new Map();
const paymentRequests = new Map();

// Generate unique IDs
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

// JWT secret (use environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-here';

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Authentication endpoints
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = Array.from(users.values()).find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // In production, verify password hash
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
    
    res.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        tagline: user.tagline,
        bio: user.bio,
        profileImage: user.profileImage,
        socialLinks: user.socialLinks,
        createdAt: user.createdAt
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// User management endpoints
app.post('/api/users', async (req, res) => {
  try {
    const { username, email, password, tagline, bio, socialLinks } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password required' });
    }

    // Check if user already exists
    const existingUser = Array.from(users.values()).find(u => 
      u.email === email || u.username === username
    );

    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = {
      id: generateId(),
      username,
      email,
      tagline: tagline || '',
      bio: bio || '',
      profileImage: '',
      socialLinks: socialLinks || {},
      passwordHash,
      createdAt: new Date()
    };

    users.set(newUser.id, newUser);

    res.json({
      success: true,
      data: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        tagline: newUser.tagline,
        bio: newUser.bio,
        profileImage: newUser.profileImage,
        socialLinks: newUser.socialLinks,
        createdAt: newUser.createdAt
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.get('/api/users/email/:email', authenticateToken, (req, res) => {
  try {
    const user = Array.from(users.values()).find(u => u.email === req.params.email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        tagline: user.tagline,
        bio: user.bio,
        profileImage: user.profileImage,
        socialLinks: user.socialLinks,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

app.get('/api/users/username/:username', authenticateToken, (req, res) => {
  try {
    const user = Array.from(users.values()).find(u => u.username === req.params.username);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        tagline: user.tagline,
        bio: user.bio,
        profileImage: user.profileImage,
        socialLinks: user.socialLinks,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

app.put('/api/users/:userId', authenticateToken, async (req, res) => {
  try {
    const user = users.get(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { username, email, tagline, bio, profileImage, socialLinks } = req.body;

    // Update user fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (tagline !== undefined) user.tagline = tagline;
    if (bio !== undefined) user.bio = bio;
    if (profileImage !== undefined) user.profileImage = profileImage;
    if (socialLinks !== undefined) user.socialLinks = socialLinks;

    users.set(user.id, user);

    res.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        tagline: user.tagline,
        bio: user.bio,
        profileImage: user.profileImage,
        socialLinks: user.socialLinks,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

app.get('/api/users/:userId', authenticateToken, (req, res) => {
  try {
    const user = users.get(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        tagline: user.tagline,
        bio: user.bio,
        profileImage: user.profileImage,
        socialLinks: user.socialLinks,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Transaction endpoints
app.get('/api/transactions', authenticateToken, (req, res) => {
  try {
    const { userId } = req.query;
    let userTransactions = Array.from(transactions.values());
    
    if (userId) {
      userTransactions = userTransactions.filter(t => t.userId === userId);
    }

    res.json({
      success: true,
      data: userTransactions
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Failed to get transactions' });
  }
});

app.post('/api/transactions', authenticateToken, (req, res) => {
  try {
    const { userId, amount, type, status, description, fromUser } = req.body;

    if (!userId || !amount || !type || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newTransaction = {
      id: generateId(),
      userId,
      amount: parseFloat(amount),
      type,
      status,
      description: description || '',
      fromUser,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    transactions.set(newTransaction.id, newTransaction);

    res.json({
      success: true,
      data: newTransaction
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// Payment links endpoints
app.get('/api/payment-links', authenticateToken, (req, res) => {
  try {
    const { userId } = req.query;
    let userLinks = Array.from(paymentLinks.values());
    
    if (userId) {
      userLinks = userLinks.filter(l => l.userId === userId);
    }

    res.json({
      success: true,
      data: userLinks
    });
  } catch (error) {
    console.error('Get payment links error:', error);
    res.status(500).json({ error: 'Failed to get payment links' });
  }
});

app.post('/api/payment-links', authenticateToken, (req, res) => {
  try {
    const { 
      userId, name, currency, reference, description, logo, 
      customerRedirectUrl, customerFailRedirectUrl, startDate, expiryDate 
    } = req.body;

    if (!userId || !name || !currency || !reference) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newLink = {
      id: generateId(),
      userId,
      name,
      currency,
      reference,
      description: description || '',
      shareUrl: `https://payments.example.com/l/${reference}`,
      logo: logo || '',
      customerRedirectUrl: customerRedirectUrl || '',
      customerFailRedirectUrl: customerFailRedirectUrl || '',
      startDate: startDate ? new Date(startDate) : null,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    paymentLinks.set(newLink.id, newLink);

    res.json({
      success: true,
      data: newLink
    });
  } catch (error) {
    console.error('Create payment link error:', error);
    res.status(500).json({ error: 'Failed to create payment link' });
  }
});

app.put('/api/payment-links/:linkId', authenticateToken, (req, res) => {
  try {
    const link = paymentLinks.get(req.params.linkId);
    if (!link) {
      return res.status(404).json({ error: 'Payment link not found' });
    }

    const { status, name, description, logo } = req.body;

    if (status) link.status = status;
    if (name) link.name = name;
    if (description !== undefined) link.description = description;
    if (logo !== undefined) link.logo = logo;

    paymentLinks.set(link.id, link);

    res.json({
      success: true,
      data: link
    });
  } catch (error) {
    console.error('Update payment link error:', error);
    res.status(500).json({ error: 'Failed to update payment link' });
  }
});

// Payouts endpoints
app.get('/api/payouts', authenticateToken, (req, res) => {
  try {
    const { userId } = req.query;
    let userPayouts = Array.from(payouts.values());
    
    if (userId) {
      userPayouts = userPayouts.filter(p => p.userId === userId);
    }

    res.json({
      success: true,
      data: userPayouts
    });
  } catch (error) {
    console.error('Get payouts error:', error);
    res.status(500).json({ error: 'Failed to get payouts' });
  }
});

app.post('/api/payouts', authenticateToken, (req, res) => {
  try {
    const { userId, amount, method, status } = req.body;

    if (!userId || !amount || !method) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newPayout = {
      id: generateId(),
      userId,
      amount: parseFloat(amount),
      method,
      status: status || 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    payouts.set(newPayout.id, newPayout);

    res.json({
      success: true,
      data: newPayout
    });
  } catch (error) {
    console.error('Create payout error:', error);
    res.status(500).json({ error: 'Failed to create payout' });
  }
});

app.put('/api/payouts/:payoutId', authenticateToken, (req, res) => {
  try {
    const payout = payouts.get(req.params.payoutId);
    if (!payout) {
      return res.status(404).json({ error: 'Payout not found' });
    }

    const { status } = req.body;
    if (status) {
      payout.status = status;
      if (status === 'completed') {
        payout.completedAt = new Date();
      }
    }

    payouts.set(payout.id, payout);

    res.json({
      success: true,
      data: payout
    });
  } catch (error) {
    console.error('Update payout error:', error);
    res.status(500).json({ error: 'Failed to update payout' });
  }
});

// Dashboard stats endpoint
app.get('/api/dashboard/stats/:userId', authenticateToken, (req, res) => {
  try {
    const userId = req.params.userId;
    const userTransactions = Array.from(transactions.values()).filter(t => t.userId === userId);
    const userPayouts = Array.from(payouts.values()).filter(p => p.userId === userId);

    const totalEarnings = userTransactions
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEarnings = userTransactions
      .filter(t => t.status === 'completed' && new Date(t.createdAt) >= today)
      .reduce((sum, t) => sum + t.amount, 0);

    const pendingPayouts = userPayouts
      .filter(p => p.status === 'pending' || p.status === 'processing')
      .reduce((sum, p) => sum + p.amount, 0);

    const stats = {
      totalEarnings,
      todayEarnings,
      pendingPayouts,
      totalTransactions: userTransactions.length
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to get dashboard stats' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Custom API Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Login endpoint: POST http://localhost:${PORT}/api/auth/login`);
});

// Export for testing
module.exports = app;