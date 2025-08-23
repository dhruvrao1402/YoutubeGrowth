const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Hardcoded users (in production, these would be in environment variables)
const USERS = {
  admin: {
    username: 'admin',
    password: '$2b$10$loYnGhoU6uClUkINj6i7beH4zngszfEO5lWswxAE.yKAFuONZXVoC', // "admin123"
    role: 'admin'
  },
  editor: {
    username: 'editor',
    password: '$2b$10$naSGV/L5V8V0.XHXwsCkdebbGWsblI1A.XpOq2.Teao1Nu9Ww8sbO', // "editor123"
    role: 'editor'
  }
};

// JWT secret (in production, this should be in environment variables)
const JWT_SECRET = 'your-super-secret-jwt-key-change-this-in-production';

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const user = USERS[username];
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        username: user.username, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Verify token middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Logout route (client-side token removal)
router.post('/logout', verifyToken, (req, res) => {
  res.json({ message: 'Logout successful' });
});

// Get current user info
router.get('/me', verifyToken, (req, res) => {
  res.json({
    username: req.user.username,
    role: req.user.role
  });
});

module.exports = { router, verifyToken };
