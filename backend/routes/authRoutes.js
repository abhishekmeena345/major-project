const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  verifyUser,
  getPendingVerifications
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

// ============================================
// Public Routes
// ============================================

// @route   POST /api/auth/register
// @desc    Register new user (Student / Company / Alumni)
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', login);

// ============================================
// Protected Routes
// ============================================

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private (All roles)
router.get('/me', protect, getMe);

// ============================================
// TPO Only Routes
// ============================================

// @route   GET /api/auth/pending-verifications
// @desc    Get all unverified users
// @access  Private (TPO only)
router.get(
  '/pending-verifications',
  protect,
  authorize('tpo'),
  getPendingVerifications
);

// @route   POST /api/auth/verify/:userId
// @desc    Verify a user account
// @access  Private (TPO only)
router.post(
  '/verify/:userId',
  protect,
  authorize('tpo'),
  verifyUser
);

module.exports = router;