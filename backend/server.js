// const express = require('express');
// const dotenv = require('dotenv');
// const path = require('path');
// const cors = require('cors');
// const morgan = require('morgan');
// const studentRoutes = require('./routes/studentRoutes');
// const alumniRoutes = require('./routes/alumniRoutes');
// const tpoRoutes = require('./routes/tpoRoutes');


// // ============================================
// // Load environment variables FIRST (before anything else)
// // ============================================
// dotenv.config({ path: path.resolve(__dirname, '.env') });

// // Now import modules that use env variables
// const connectDB = require('./config/db');
// const { errorHandler } = require('./middleware/errorMiddleware');

// // Connect to MongoDB
// connectDB();

// // Initialize Express app
// const app = express();

// // ============================================
// // Middleware
// // ============================================

// // Enable CORS
// app.use(cors());

// // Body parser
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Request logging (development only)
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }

// // ============================================
// // Routes
// // ============================================

// // Auth routes
// app.use('/api/auth', require('./routes/authRoutes'));

// // Job routes
// app.use('/api/jobs', require('./routes/jobRoutes'));

// // TPO routes
// app.use('/api/tpo', require('./routes/tpoRoutes'));
// // Student routes - ADD THIS LINE
// app.use('/api/students', require('./routes/studentRoutes'));
// app.use('/api/companies', require('./routes/companyRoutes'));
// // AI routes
// app.use('/api/ai', require('./routes/aiRoutes'));
// // Interview routes
// app.use('/api/interviews', require('./routes/interviewRoutes'));

// // Notification routes
// app.use('/api/notifications', require('./routes/notificationRoutes'));

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use('/api/students', studentRoutes);
// app.use('/api/alumni', alumniRoutes);
// app.use('/api/tpo', tpoRoutes);

// // ============================================
// // Health Check Route
// // ============================================
// app.get('/api/health', (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: 'Smart Placement Portal API is running',
//     timestamp: new Date().toISOString()
//   });
// });

// // ============================================
// // 404 Handler
// // ============================================
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: `Route ${req.originalUrl} not found`
//   });
// });

// // ============================================
// // Global Error Handler
// // ============================================
// app.use(errorHandler);

// // ============================================
// // Start Server
// // ============================================
// const PORT = process.env.PORT || 5555;

// const server = app.listen(PORT, () => {
//   console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
//   console.log(`📡 API URL: http://localhost:${PORT}/api`);
// });

// // Handle unhandled promise rejections
// process.on('unhandledRejection', (err) => {
//   console.error(`❌ Unhandled Rejection: ${err.message}`);
//   // Close server & exit process
//   server.close(() => process.exit(1));
// });

// // Handle uncaught exceptions
// process.on('uncaughtException', (err) => {
//   console.error(`❌ Uncaught Exception: ${err.message}`);
//   process.exit(1);
// });


const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');

// ============================================
// Load environment variables FIRST
// ============================================
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Now import modules that use env variables
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// ============================================
// Middleware
// ============================================

// Enable CORS
app.use(cors());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (development only)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================================
// Routes — All in one place, no duplicates
// ============================================

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/companies', require('./routes/companyRoutes'));
app.use('/api/alumni', require('./routes/alumniRoutes'));
app.use('/api/tpo', require('./routes/tpoRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/interviews', require('./routes/interviewRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// ============================================
// Health Check Route
// ============================================
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Smart Placement Portal API is running',
    timestamp: new Date().toISOString()
  });
});

// ============================================
// 404 Handler
// ============================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// ============================================
// Global Error Handler
// ============================================
app.use(errorHandler);

// ============================================
// Start Server
// ============================================
const PORT = process.env.PORT || 5555;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`📡 API URL: http://localhost:${PORT}/api`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`❌ Uncaught Exception: ${err.message}`);
  process.exit(1);
});