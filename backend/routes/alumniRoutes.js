const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { validateObjectId } = require('../middleware/validationMiddleware');
const {
  getMyProfile,
  updateMyProfile,
  getReferrals,
  respondToReferral
} = require('../controllers/alumniController');

router.use(protect, authorize('alumni'));

router.get('/profile', getMyProfile);
router.put('/profile', updateMyProfile);
router.get('/referrals', getReferrals);
router.put('/referrals/:referralId', validateObjectId('referralId'), respondToReferral);

module.exports = router;