const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');

dotenv.config();
connectDB();

const app = express();

// Middlewares
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'https://your-frontend-domain.netlify.app', // Add your actual frontend domain here
    process.env.FRONTEND_URL
  ].filter(Boolean), // Remove undefined values
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions)); // Enable Cross-Origin Resource Sharing
app.use(express.json());

// API Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/problems', require('./routes/problemRoutes'));
app.use('/api/submissions', require('./routes/submissionRoutes'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ message: 'Online Judge API is running!' });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Online Judge API Server', 
    status: 'Running',
    endpoints: {
      health: '/api/health',
      users: '/api/users',
      problems: '/api/problems',
      submissions: '/api/submissions'
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Online Judge Server running on port ${PORT}`));
