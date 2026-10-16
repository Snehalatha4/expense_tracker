const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { connectDB } = require('./config/db');
const transactionRoutes = require('./routes/transactionRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const authRoutes = require('./routes/authRoutes');
const goalRoutes = require('./routes/goalRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const { seedData } = require('./scripts/seedHelper');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  res.status(200).json({
    success: true,
    message: 'SpendSmart API is up and running ✨',
    environment: process.env.NODE_ENV || 'development',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budget', budgetRoutes);

// Error Handling Middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Connect to MongoDB and start server (if not imported for testing)
if (process.env.NODE_ENV !== 'test') {
  connectDB()
    .then(async () => {
      // Auto seed if database is empty and auto seed is enabled
      if (process.env.AUTO_SEED_IF_EMPTY === 'true') {
        try {
          const res = await seedData(false);
          if (res.seeded) {
            console.log(`🌸 Initial demonstration data auto-seeded (${res.count} transactions).`);
          }
        } catch (seedErr) {
          console.warn('Auto-seed notice:', seedErr.message);
        }
      }

      app.listen(PORT, () => {
        console.log(`🌸 SpendSmart Backend Server running on http://localhost:${PORT}`);
        console.log(`📊 Health Check: http://localhost:${PORT}/api/health`);
        console.log(`💼 Transactions API: http://localhost:${PORT}/api/transactions?month=2026-10`);
      });
    })
    .catch((err) => {
      console.error('Failed to connect to MongoDB on startup:', err.message);
      app.listen(PORT, () => {
        console.log(`⚠️ SpendSmart Server running on http://localhost:${PORT} (Database pending connection)`);
      });
    });
}

module.exports = app;
