// // const express = require('express');
// // const router = express.Router();
// // const {
// //   getProfile,
// //   updateProfile,
// //   getRecommendedJobs,
// //   getApplications,
// //   applyForJob,
// //   getPlacementProbability
// // } = require('../controllers/studentController');
// // const { protect, authorize } = require('../middleware/authMiddleware');
// // const { validateObjectId } = require('../middleware/validationMiddleware');
// // const { upload } = require('../middleware/uploadMiddleware');

// // // ============================================
// // // All routes are Student only
// // // ============================================
// // router.use(protect, authorize('student'));

// // // @route   GET /api/students/profile
// // // @desc    Get student profile
// // router.get('/profile', getProfile);

// // // @route   PUT /api/students/profile
// // // @desc    Update student profile
// // router.put('/profile', updateProfile);

// // // @route   GET /api/students/recommended-jobs
// // // @desc    Get recommended jobs
// // router.get('/recommended-jobs', getRecommendedJobs);

// // // @route   GET /api/students/applications
// // // @desc    Get my applications
// // router.get('/applications', getApplications);

// // // @route   POST /api/students/apply/:jobId
// // // @desc    Apply for a job
// // router.post('/apply/:jobId', validateObjectId('jobId'), applyForJob);

// // // @route   GET /api/students/placement-probability
// // // @desc    Get placement probability
// // router.get('/placement-probability', getPlacementProbability);
// // router.put('/profile', protect, authorize('student'), upload.single('resume'), updateProfile);

// // module.exports = router;
// const express = require('express');
// const router = express.Router();
// const { upload } = require('../middleware/uploadMiddleware');
// const { protect, authorize } = require('../middleware/authMiddleware');
// const {
//   getProfile,
//   updateProfile,
//   getProfileStatus,
//   getApplications,
//   applyForJob,
//   getRecommendedJobs,
//   getPlacementProbability
// } = require('../controllers/studentController');

// // All routes protected and student-only
// router.use(protect);
// router.use(authorize('student'));

// // @route   GET /api/students/profile
// router.get('/profile', getProfile);

// // @route   PUT /api/students/profile
// router.put('/profile', upload.single('resume'), updateProfile);

// // @route   GET /api/students/profile-status
// router.get('/profile-status', getProfileStatus);

// // @route   GET /api/students/applications
// router.get('/applications', getApplications);

// // @route   POST /api/students/apply/:jobId
// router.post('/apply/:jobId', applyForJob);

// // @route   GET /api/students/recommended-jobs
// router.get('/recommended-jobs', getRecommendedJobs);

// // @route   GET /api/students/placement-probability
// router.get('/placement-probability', getPlacementProbability);

// module.exports = router;
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');
const {
  getProfile,
  updateProfile,
  getProfileStatus,
  getApplications,
  applyForJob,
  getRecommendedJobs,
  getPlacementProbability,
  getAlumniList,
  requestReferral,
  getMyReferrals
} = require('../controllers/studentController');

router.use(protect, authorize('student'));

router.get('/profile', getProfile);
router.put('/profile', upload.single('resume'), updateProfile);
router.get('/profile-status', getProfileStatus);
router.get('/applications', getApplications);
router.post('/apply/:jobId', applyForJob);
router.get('/recommended-jobs', getRecommendedJobs);
router.get('/placement-probability', getPlacementProbability);

// NEW Alumni Routes
router.get('/alumni', getAlumniList);
router.post('/referral/:alumniId', requestReferral);
router.get('/my-referrals', getMyReferrals);

module.exports = router;