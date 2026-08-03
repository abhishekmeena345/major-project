const express = require('express');
const router = express.Router();
const multer = require('multer');
const { 
  parseResume, 
  getResumeData, 
  parseResumePDF,
  chatWithAI,
  generateInterviewQuestions,
  evaluateAnswer
} = require('../controllers/aiController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Multer config — memory storage (no disk save needed)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// ============================================
// AI Routes - Student Only
// ============================================
router.use(protect, authorize('student'));

// @route   POST /api/ai/chat
// @desc    General AI Chat - Student kuch bhi puche
router.post('/chat', chatWithAI);

// @route   POST /api/ai/generate-interview
// @desc    Generate random AI interview questions
router.post('/generate-interview', generateInterviewQuestions);

// @route   POST /api/ai/evaluate-answer
// @desc    Evaluate interview answer with AI
router.post('/evaluate-answer', evaluateAnswer);

// @route   POST /api/ai/parse-resume
// @desc    Parse resume text and extract data
router.post('/parse-resume', parseResume);

// @route   POST /api/ai/parse-resume-pdf
// @desc    Upload PDF, extract text, parse with AI
router.post('/parse-resume-pdf', upload.single('resume'), parseResumePDF);

// @route   GET /api/ai/resume-data
// @desc    Get last parsed resume data
router.get('/resume-data', getResumeData);

module.exports = router;