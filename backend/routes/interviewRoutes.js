const express = require('express');
const router = express.Router();
const {
  startInterview,
  submitAnswer,
  completeInterview,
  getInterviewHistory
} = require('../controllers/interviewController');
const { protect, authorize } = require('../middleware/authMiddleware');

// ============================================
// Interview Routes - Student Only
// ============================================
router.use(protect, authorize('student'));

// @route   POST /api/interviews/start
// @desc    Start new mock interview
router.post('/start', startInterview);

// @route   POST /api/interviews/submit-answer
// @desc    Submit answer and get feedback
router.post('/submit-answer', submitAnswer);

// @route   POST /api/interviews/complete
// @desc    Complete interview and get report
router.post('/complete', completeInterview);

// @route   GET /api/interviews/history
// @desc    Get interview history
router.get('/history', getInterviewHistory);

module.exports = router;