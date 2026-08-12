require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const resumeRoutes = require('./routes/resumeRoutes');

const app = express();

// Configure CORS
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://ai-interview-platform-3-j9oi.onrender.com',
  ],
  credentials: true,
}));

// Middleware to parse JSON request bodies
app.use(express.json());

// Register API routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/resume', resumeRoutes);

// Basic test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start Server
const PORT = process.env.PORT || 5000;

// '0.0.0.0' allows GitHub Codespaces proxy to route traffic to port 5000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});