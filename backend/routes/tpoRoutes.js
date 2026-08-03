// const express = require('express');
// const router = express.Router();
// const {
//   getProfile,
//   updateProfile,
//   getAnalytics,
//   getStudents,
//   getCompanies,
//   broadcastNotification,
//   getPlacements
// } = require('../controllers/tpoController');
// const { protect, authorize } = require('../middleware/authMiddleware');
// const { validateBroadcast } = require('../middleware/validationMiddleware');

// // ============================================
// // All routes are TPO only
// // ============================================
// router.use(protect, authorize('tpo'));

// // @route   GET /api/tpo/profile
// // @desc    Get TPO profile
// router.get('/profile', getProfile);

// // @route   PUT /api/tpo/profile
// // @desc    Update TPO profile
// router.put('/profile', updateProfile);

// // @route   GET /api/tpo/analytics
// // @desc    Get placement analytics
// router.get('/analytics', getAnalytics);

// // @route   GET /api/tpo/students
// // @desc    Get all students with filters
// router.get('/students', getStudents);

// // @route   GET /api/tpo/companies
// // @desc    Get all companies
// router.get('/companies', getCompanies);

// // @route   POST /api/tpo/broadcast
// // @desc    Broadcast notification
// router.post('/broadcast', validateBroadcast, broadcastNotification);

// // @route   GET /api/tpo/placements
// // @desc    Get recent placements
// router.get('/placements', getPlacements);

// module.exports = router;
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { validateObjectId } = require('../middleware/validationMiddleware');
const {
  getDashboardStats,
  getPendingVerifications,
  verifyUser,
  rejectUser,
  getProfile,
  updateProfile,
  getAnalytics,
  getStudents,
  getCompanies,
  getJobs,
  broadcast,
  getPlacements
} = require('../controllers/tpoController');

router.use(protect, authorize('tpo'));

// NEW Verification Routes
router.get('/dashboard-stats', getDashboardStats);
router.get('/pending-verifications', getPendingVerifications);
router.post('/verify/:userId', validateObjectId('userId'), verifyUser);
router.delete('/reject/:userId', validateObjectId('userId'), rejectUser);

// EXISTING Routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/analytics', getAnalytics);
router.get('/students', getStudents);
router.get('/companies', getCompanies);
router.get('/jobs', getJobs);
router.post('/broadcast', broadcast);
router.get('/placements', getPlacements);

module.exports = router;