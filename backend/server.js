/**
 * SmartFactory AI — Backend Server
 * Entry point for Express.js REST API
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ─────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ─── Routes ────────────────────────────────────────────────────
app.use('/api/auth',       require('./routes/authRoutes'));
app.use('/api/machines',   require('./routes/machineRoutes'));
app.use('/api/workers',    require('./routes/workerRoutes'));
app.use('/api/inventory',  require('./routes/inventoryRoutes'));
app.use('/api/production', require('./routes/productionRoutes'));
app.use('/api/alerts',     require('./routes/alertRoutes'));
app.use('/api/analytics',  require('./routes/analyticsRoutes'));
app.use('/api/maintenance',require('./routes/maintenanceRoutes'));
app.use('/api/safety',     require('./routes/safetyRoutes'));

// ─── Health check ───────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'SmartFactory API running', time: new Date().toISOString() });
});

// ─── 404 handler ───────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── Error handler ─────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// ─── Database connection ────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smartfactory')
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 SmartFactory API running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

module.exports = app;
