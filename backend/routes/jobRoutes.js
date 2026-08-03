const express = require('express');
const router = express.Router();
const {
  createJob,
  getJobs,
  getMyJobs,
  getJobById,
  updateJob,
  deleteJob,
  getJobApplicants
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validateJob, validateObjectId } = require('../middleware/validationMiddleware');

// ============================================
// Public Routes
// ============================================

// @route   GET /api/jobs
// @desc    Get all active jobs
// @access  Public
router.get('/', getJobs);

// ============================================
// Protected Routes - Company Only
// SPECIFIC routes must come BEFORE /:id generic routes!
// ============================================

// @route   GET /api/jobs/my-jobs
// @desc    Get company's own jobs
// @access  Private (Company)
// ⚠️ MUST be before /:id route!
router.get('/my-jobs', protect, authorize('company'), getMyJobs);

// @route   POST /api/jobs
// @desc    Create new job
// @access  Private (Company)
router.post('/', protect, authorize('company'), validateJob, createJob);

// ============================================
// Generic ID Routes — MUST come last!
// ============================================

// @route   GET /api/jobs/:id
// @desc    Get single job by ID
// @access  Public
router.get('/:id', validateObjectId('id'), getJobById);

// @route   PUT /api/jobs/:id
// @desc    Update job
// @access  Private (Company)
router.put('/:id', protect, authorize('company'), validateObjectId('id'), validateJob, updateJob);

// @route   DELETE /api/jobs/:id
// @desc    Close job
// @access  Private (Company)
router.delete('/:id', protect, authorize('company'), validateObjectId('id'), deleteJob);

// @route   GET /api/jobs/:id/applicants
// @desc    Get job applicants
// @access  Private (Company)
router.get('/:id/applicants', protect, authorize('company'), validateObjectId('id'), getJobApplicants);

module.exports = router;