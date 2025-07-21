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
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5174',
      'https://code-judge-pothan0s-projects.vercel.app',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Allow any vercel.app domain
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    
    // Log blocked origin for debugging
    console.log('🚫 CORS blocked origin:', origin);
    callback(new Error('Not allowed by CORS'));
  },
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
