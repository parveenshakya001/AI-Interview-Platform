require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Allow requests from your React frontend
app.use(cors({

 origin: [
    'http://localhost:5173',
    'https://sturdy-carnival-pj4x6x4pwxj5f66xw-5173.app.github.dev',
  ],// ← put your React app's Codespaces URL here
  credentials: true,
  origin: true
}));

// Middleware to parse JSON request bodies
app.use(express.json());

// Register routes
app.use('/api/auth', authRoutes);

// Basic test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const dashboardRoutes = require('./routes/dashboardRoutes');
// ...
app.use('/api/dashboard', dashboardRoutes);

const resumeRoutes = require('./routes/resumeRoutes');
app.use('/api/resume', resumeRoutes);