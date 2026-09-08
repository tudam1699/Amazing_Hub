const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Environment Variables
const MONGODB_URI = process.env.MONGODB_URI;

// MongoDB Connection
if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB Connected Successfully'))
    .catch(err => console.error('MongoDB Connection Error:', err));
}

// Login Route
app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};
  
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password required' });
  }

  // Direct login credentials check
  if (username.toLowerCase() === 'admin' && password === 'admin123') {
    return res.json({ success: true, message: 'Logged in successfully' });
  }
  
  return res.status(400).json({ success: false, message: 'Invalid Credentials' });
});

// Serve Frontend Files
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Export app for Vercel
module.exports = app;
