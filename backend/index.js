require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import API Routes
const apiRoutes = require('./src/routes/index');

// Mount API Routes
app.use('/api/v1', apiRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Hero Logistic Clone API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
