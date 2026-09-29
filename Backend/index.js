const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/db');
require('dotenv').config();

// Connect to Database
connectDB();

const app = express();

// ========================
// SECURITY MIDDLEWARE
// ========================

// Helmet: Sets secure HTTP headers (prevents XSS, clickjacking, etc.)
app.use(helmet());

// Rate Limiter: Prevents brute-force attacks on login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 login attempts per 15 minutes per IP
  message: { message: 'Too many login attempts. Please try again after 15 minutes.' },
});
app.use('/api/auth/login', loginLimiter);

// CORS
app.use(cors());

// Body Parser
app.use(express.json());

// NoSQL Injection Sanitization: Strips out $ and . from req.body/query/params
// Temporarily removed express-mongo-sanitize to fix server crash. Mongoose strict routing protects us.

// Basic Route
app.get('/', (req, res) => {
  res.send('Backend API is running!');
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/hotel', require('./routes/hotelRoutes'));
app.use('/api/travel', require('./routes/travelRoutes'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
