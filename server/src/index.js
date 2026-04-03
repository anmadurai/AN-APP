const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. HELMET FIRST
app.use(helmet());

// 2. COOKIE PARSER
app.use(cookieParser());

// 3. CORS CONFIG - MUST BE BEFORE ROUTES
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean); // remove empty/undefined values

app.use(cors({
  origin: function (origin, callback) {
    // 1. Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    const isVercelSubdomain = origin.match(/https?:\/\/.*\.vercel\.app$/);
    const isLocalhost = origin.match(/https?:\/\/localhost(:\d+)?$/);

    if (isVercelSubdomain || isLocalhost || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Fallback: log for debug, but allow during this stage if unsure?
    // Let's be strict for security but helpful.
    callback(null, false); // Just deny instead of throwing error
  },
  credentials: true
}));

// 4. BODY PARSER
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const videoRoutes = require('./routes/videos');

// Health check (at root level)
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Routes usage
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/videos', videoRoutes);

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
  });
}

// Catch-all route for debugging Vercel deployment
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Express catch-all 404',
    url: req.url,
    originalUrl: req.originalUrl,
    path: req.path
  });
});

module.exports = app;
