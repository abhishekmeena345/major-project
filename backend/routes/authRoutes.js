const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/uploadMiddleware');
const {
  register,
  login,
  getMe,
  verifyUser,
  getPendingVerifications
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validateLogin, validateObjectId } = require('../middleware/validationMiddleware');

// ============================================
// Public Routes
// ============================================

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
// NOTE: upload.single('resume') pehle chalega taaki req.body populate ho
router.post('/register', upload.single('resume'), register);

// @route   POST /api/auth/login
// @access  Public
router.post('/login', validateLogin, login);

// ============================================
// Protected Routes
// ============================================

router.get('/me', protect, getMe);

// ============================================
// TPO Only Routes
// ============================================

router.get('/pending-verifications', protect, authorize('tpo'), getPendingVerifications);

router.post('/verify/:userId', protect, authorize('tpo'), validateObjectId('userId'), verifyUser);

module.exports = router;