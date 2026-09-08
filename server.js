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

// Service Schema & Model
const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);

// API Routes

// 1. Admin Login API
app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};
  
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password required' });
  }

  if (username.toLowerCase() === 'admin' && password === 'admin123') {
    return res.json({ success: true, message: 'Logged in successfully' });
  }
  
  return res.status(400).json({ success: false, message: 'Invalid Credentials' });
});

// 2. Add New Service API (MongoDB Mein Save Karega)
app.post('/api/services', async (req, res) => {
  try {
    const { title, description, price } = req.body;
    if (!title || !description || !price) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const newService = new Service({ title, description, price });
    await newService.save();
    return res.json({ success: true, message: 'Service added successfully!' });
  } catch (err) {
    console.error('Error adding service:', err);
    return res.status(500).json({ success: false, message: 'Server error while saving service' });
  }
});

// 3. Get All Services API (MongoDB Se Fetch Karega)
app.get('/api/services', async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    return res.json(services);
  } catch (err) {
    console.error('Error fetching services:', err);
    return res.status(500).json({ success: false, message: 'Error fetching services' });
  }
});

// Route for Admin Page
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Fallback Route for Main Website
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;
