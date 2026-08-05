require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

const cookieParser = require('cookie-parser');
const errorHandler = require('./src/middlewares/errorHandler');

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Import API Routes
const apiRoutes = require('./src/routes/index');

// Mount API Routes
app.use('/api/v1', apiRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Hero Logistic Clone API' });
});

// Global Error handling middleware
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
