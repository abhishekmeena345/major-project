const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getDashboardStats,
  getJobApplicants,
  updateApplicationStatus,
  scheduleInterview
} = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validateObjectId } = require('../middleware/validationMiddleware');

// ============================================
// All routes are Company only
// ============================================
router.use(protect, authorize('company'));

// @route   GET /api/companies/profile
// @desc    Get company profile
router.get('/profile', getProfile);

// @route   PUT /api/companies/profile
// @desc    Update company profile
router.put('/profile', updateProfile);

// @route   GET /api/companies/dashboard-stats
// @desc    Get dashboard stats
router.get('/dashboard-stats', getDashboardStats);

// @route   GET /api/companies/jobs/:jobId/applicants
// @desc    Get job applicants with AI ranking
router.get('/jobs/:jobId/applicants', validateObjectId('jobId'), getJobApplicants);

// @route   PUT /api/companies/applications/:applicationId/status
// @desc    Update application status
router.put('/applications/:applicationId/status', validateObjectId('applicationId'), updateApplicationStatus);

// @route   POST /api/companies/applications/:applicationId/schedule
// @desc    Schedule interview
router.post('/applications/:applicationId/schedule', validateObjectId('applicationId'), scheduleInterview);

module.exports = router;