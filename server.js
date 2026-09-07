const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Environment Variables
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'amazinghub';
const ADMIN_HASH = process.env.ADMIN_HASH;

// MongoDB Connection
if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas.'))
    .catch(err => console.error('MongoDB Connection Error:', err));
} else {
  console.log('Running in local mode without MongoDB Atlas URI.');
}

// Service Schema & Model
const serviceSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: String,
  category: String
});
const Service = mongoose.model('Service', serviceSchema);

// Admin Login Route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (username !== ADMIN_USERNAME) {
    return res.status 401).json({ message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, ADMIN_HASH);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1d' });
  res.json({ success: true, token });
});

// Middleware to Protect Admin Routes
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

// Public Route: Get Services
app.get('/api/services', async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching services' });
  }
});

// Protected Route: Update Services
app.post('/api/services', authenticate, async (req, res) => {
  try {
    const newService = new Service(req.body);
    await newService.save();
    res.json({ message: 'Service added successfully', service: newService });
  } catch (err) {
    res.status(500).json({ message: 'Server error saving service' });
  }
});

// Serve Frontend Index Page
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Amazing Hub Server running on port ${PORT}`);
});
