// const asyncHandler = require('express-async-handler');
// const User = require('../models/User');
// const Student = require('../models/Student');
// const Company = require('../models/Company');
// const Application = require('../models/Application');
// const Notification = require('../models/Notification');  // Tera existing model
// const { ErrorResponse } = require('../middleware/errorMiddleware');

// // ============================================
// // @desc    Get Alumni Dashboard Stats
// // @route   GET /api/alumni/dashboard-stats
// // @access  Private (Alumni)
// // ============================================
// const getDashboardStats = asyncHandler(async (req, res) => {
//   const totalStudents = await User.countDocuments({ role: 'student' });
//   const totalCompanies = await User.countDocuments({ role: 'company' });
//   const pendingVerifications = await User.countDocuments({ isVerified: false });
  
//   const placedApps = await Application.find({ status: 'placed' }).distinct('studentId');
//   const placedCount = placedApps.length;
//   const totalStudentsCount = await User.countDocuments({ role: 'student' });

//   const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
//   const recentStudents = await User.countDocuments({ 
//     role: 'student', 
//     createdAt: { $gte: lastWeek } 
//   });

//   res.status(200).json({
//     success: true,
//     data: {
//       totalStudents: totalStudentsCount,
//       totalCompanies,
//       pendingVerifications,
//       placedCount,
//       recentStudents,
//       placementRate: totalStudentsCount > 0 ? Math.round((placedCount / totalStudentsCount) * 100) : 0
//     }
//   });
// });

// // ============================================
// // @desc    Get all students with filters
// // @route   GET /api/alumni/students
// // @access  Private (Alumni)
// // ============================================
// const getAllStudents = asyncHandler(async (req, res) => {
//   const { branch, year, search } = req.query;
  
//   let query = {};
//   if (branch) query['personalInfo.branch'] = branch;
//   if (year) query['personalInfo.year'] = parseInt(year);

//   const students = await Student.find(query)
//     .populate('userId', 'email isVerified createdAt')
//     .sort({ createdAt: -1 });

//   const studentsWithStatus = await Promise.all(
//     students.map(async (student) => {
//       const apps = await Application.find({ studentId: student.userId._id });
//       const status = apps.some(a => a.status === 'placed') ? 'placed' :
//                     apps.some(a => a.status === 'interview') ? 'interview' :
//                     apps.some(a => a.status === 'shortlisted') ? 'shortlisted' :
//                     apps.length > 0 ? 'applied' : 'not-applied';
      
//       return {
//         ...student.toObject(),
//         placementStatus: status,
//         totalApplications: apps.length
//       };
//     })
//   );

//   res.status(200).json({
//     success: true,
//     count: studentsWithStatus.length,
//     data: studentsWithStatus
//   });
// });

// // ============================================
// // @desc    Get all companies
// // @route   GET /api/alumni/companies
// // @access  Private (Alumni)
// // ============================================
// const getAllCompanies = asyncHandler(async (req, res) => {
//   const companies = await Company.find()
//     .populate('userId', 'email isVerified createdAt')
//     .sort({ createdAt: -1 });

//   res.status(200).json({
//     success: true,
//     count: companies.length,
//     data: companies
//   });
// });

// // ============================================
// // @desc    Get pending verifications
// // @route   GET /api/alumni/pending-verifications
// // @access  Private (Alumni)
// // ============================================
// const getPendingVerifications = asyncHandler(async (req, res) => {
//   const pendingUsers = await User.find({ isVerified: false })
//     .select('-password')
//     .sort({ createdAt: -1 });

//   const usersWithProfile = await Promise.all(
//     pendingUsers.map(async (user) => {
//       let profile = null;
//       if (user.role === 'student') {
//         profile = await Student.findOne({ userId: user._id }).select('personalInfo');
//       } else if (user.role === 'company') {
//         profile = await Company.findOne({ userId: user._id }).select('name');
//       }
//       return { ...user.toObject(), profile };
//     })
//   );

//   res.status(200).json({
//     success: true,
//     count: usersWithProfile.length,
//     data: usersWithProfile
//   });
// });

// // ============================================
// // @desc    Verify a user + send notification
// // @route   POST /api/alumni/verify/:userId
// // @access  Private (Alumni)
// // ============================================
// const verifyUser = asyncHandler(async (req, res) => {
//   const { userId } = req.params;

//   const user = await User.findById(userId);
//   if (!user) throw new ErrorResponse('User not found', 404);
//   if (user.isVerified) throw new ErrorResponse('User is already verified', 400);

//   user.isVerified = true;
//   await user.save();

//   // ✅ Tere existing Notification model ke hisaab se
//   await Notification.create({
//     title: 'Account Verified',
//     message: 'Your account has been verified by Alumni. You can now login and apply for jobs.',
//     type: 'general',
//     senderId: req.user._id,
//     senderRole: 'tpo',  // Alumni ko TPO ki tarah treat kar rahe hain ya 'alumni' add kar le enum mein
//     isGlobal: false,
//     targetRoles: [user.role]  // Sirf verified user ko dikhne wala nahi, global nahi hai
//   });

//   res.status(200).json({
//     success: true,
//     message: `${user.role === 'student' ? 'Student' : 'Company'} verified successfully`,
//     data: { _id: user._id, email: user.email, role: user.role, isVerified: user.isVerified }
//   });
// });

// // ============================================
// // @desc    Reject/Delete unverified user
// // @route   DELETE /api/alumni/reject/:userId
// // @access  Private (Alumni)
// // ============================================
// const rejectUser = asyncHandler(async (req, res) => {
//   const { userId } = req.params;

//   const user = await User.findById(userId);
//   if (!user) throw new ErrorResponse('User not found', 404);
//   if (user.isVerified) throw new ErrorResponse('Cannot delete verified user', 400);

//   if (user.role === 'student') await Student.deleteOne({ userId: user._id });
//   else if (user.role === 'company') await Company.deleteOne({ userId: user._id });

//   await User.deleteOne({ _id: userId });

//   res.status(200).json({
//     success: true,
//     message: 'User rejected and removed successfully'
//   });
// });

// // ============================================
// // @desc    Broadcast message to all students
// // @route   POST /api/alumni/broadcast
// // @access  Private (Alumni)
// // ============================================
// const broadcastMessage = asyncHandler(async (req, res) => {
//   const { title, message, targetBranches, targetYears } = req.body;

//   if (!title || !message) throw new ErrorResponse('Please provide title and message', 400);

//   // ✅ Tere existing Notification model ke hisaab se
//   await Notification.create({
//     title,
//     message,
//     type: 'broadcast',
//     senderId: req.user._id,
//     senderRole: 'tpo',  // Ya 'alumni' enum mein add kar de
//     isGlobal: true,
//     targetBranches: targetBranches || [],
//     targetYears: targetYears || [],
//     targetRoles: ['student']
//   });

//   res.status(200).json({
//     success: true,
//     message: 'Broadcast sent to all students'
//   });
// });

// // ============================================
// // @desc    Get analytics
// // @route   GET /api/alumni/analytics
// // @access  Private (Alumni)
// // ============================================
// const getAnalytics = asyncHandler(async (req, res) => {
//   const branchStats = await Student.aggregate([
//     { $group: { _id: '$personalInfo.branch', count: { $sum: 1 } } }
//   ]);

//   const placedApps = await Application.find({ status: 'placed' }).distinct('studentId');
//   const totalStudents = await User.countDocuments({ role: 'student' });

//   res.status(200).json({
//     success: true,
//     data: {
//       branchStats,
//       placementRate: totalStudents > 0 ? Math.round((placedApps.length / totalStudents) * 100) : 0,
//       totalPlaced: placedApps.length
//     }
//   });
// });

// module.exports = {
//   getDashboardStats,
//   getAllStudents,
//   getAllCompanies,
//   getPendingVerifications,
//   verifyUser,
//   rejectUser,
//   broadcastMessage,
//   getAnalytics
// };
// const asyncHandler = require('express-async-handler');
// const User = require('../models/User');
// const Student = require('../models/Student');
// const Company = require('../models/Company');
// const Application = require('../models/Application');
// const Notification = require('../models/Notification');
// const { ErrorResponse } = require('../middleware/errorMiddleware');

// // ============================================
// // @desc    Get Alumni Dashboard Stats
// // @route   GET /api/alumni/dashboard-stats
// // @access  Private (Alumni)
// // ============================================
// const getDashboardStats = asyncHandler(async (req, res) => {
//   const totalStudents = await User.countDocuments({ role: 'student' });
//   const totalCompanies = await User.countDocuments({ role: 'company' });
//   const pendingVerifications = await User.countDocuments({ isVerified: false });
  
//   const placedApps = await Application.find({ status: 'placed' }).distinct('studentId');
//   const placedCount = placedApps.length;
//   const totalStudentsCount = await User.countDocuments({ role: 'student' });

//   const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
//   const recentStudents = await User.countDocuments({ 
//     role: 'student', 
//     createdAt: { $gte: lastWeek } 
//   });

//   res.status(200).json({
//     success: true,
//     data: {
//       totalStudents: totalStudentsCount,
//       totalCompanies,
//       pendingVerifications,
//       placedCount,
//       recentStudents,
//       placementRate: totalStudentsCount > 0 ? Math.round((placedCount / totalStudentsCount) * 100) : 0
//     }
//   });
// });

// // ============================================
// // @desc    Get all students with filters
// // @route   GET /api/alumni/students
// // @access  Private (Alumni)
// // ============================================
// const getAllStudents = asyncHandler(async (req, res) => {
//   const { branch, year, search } = req.query;
  
//   let query = {};
//   if (branch) query['personalInfo.branch'] = branch;
//   if (year) query['personalInfo.year'] = parseInt(year);

//   const students = await Student.find(query)
//     .populate('userId', 'email isVerified createdAt')
//     .sort({ createdAt: -1 });

//   // ✅ FIXED: Null check for userId
//   const studentsWithStatus = await Promise.all(
//     students.map(async (student) => {
//       // ⚠️ If userId is null (orphan student document), skip gracefully
//       if (!student.userId) {
//         return {
//           ...student.toObject(),
//           placementStatus: 'unknown',
//           totalApplications: 0
//         };
//       }

//       const apps = await Application.find({ studentId: student.userId._id });
//       const status = apps.some(a => a.status === 'placed') ? 'placed' :
//                     apps.some(a => a.status === 'interview') ? 'interview' :
//                     apps.some(a => a.status === 'shortlisted') ? 'shortlisted' :
//                     apps.length > 0 ? 'applied' : 'not-applied';
      
//       return {
//         ...student.toObject(),
//         placementStatus: status,
//         totalApplications: apps.length
//       };
//     })
//   );

//   res.status(200).json({
//     success: true,
//     count: studentsWithStatus.length,
//     data: studentsWithStatus
//   });
// });

// // ============================================
// // @desc    Get all companies
// // @route   GET /api/alumni/companies
// // @access  Private (Alumni)
// // ============================================
// const getAllCompanies = asyncHandler(async (req, res) => {
//   const companies = await Company.find()
//     .populate('userId', 'email isVerified createdAt')
//     .sort({ createdAt: -1 });

//   res.status(200).json({
//     success: true,
//     count: companies.length,
//     data: companies
//   });
// });

// // ============================================
// // @desc    Get pending verifications
// // @route   GET /api/alumni/pending-verifications
// // @access  Private (Alumni)
// // ============================================
// const getPendingVerifications = asyncHandler(async (req, res) => {
//   const pendingUsers = await User.find({ isVerified: false })
//     .select('-password')
//     .sort({ createdAt: -1 });

//   const usersWithProfile = await Promise.all(
//     pendingUsers.map(async (user) => {
//       let profile = null;
//       if (user.role === 'student') {
//         profile = await Student.findOne({ userId: user._id }).select('personalInfo');
//       } else if (user.role === 'company') {
//         profile = await Company.findOne({ userId: user._id }).select('name');
//       }
//       return { ...user.toObject(), profile };
//     })
//   );

//   res.status(200).json({
//     success: true,
//     count: usersWithProfile.length,
//     data: usersWithProfile
//   });
// });

// // ============================================
// // @desc    Verify a user + send notification
// // @route   POST /api/alumni/verify/:userId
// // @access  Private (Alumni)
// // ============================================
// const verifyUser = asyncHandler(async (req, res) => {
//   const { userId } = req.params;

//   const user = await User.findById(userId);
//   if (!user) throw new ErrorResponse('User not found', 404);
//   if (user.isVerified) throw new ErrorResponse('User is already verified', 400);

//   user.isVerified = true;
//   await user.save();

//   await Notification.create({
//     title: 'Account Verified',
//     message: 'Your account has been verified by Alumni. You can now login and apply for jobs.',
//     type: 'general',
//     senderId: req.user._id,
//     senderRole: 'tpo',
//     isGlobal: false,
//     targetRoles: [user.role]
//   });

//   res.status(200).json({
//     success: true,
//     message: `${user.role === 'student' ? 'Student' : 'Company'} verified successfully`,
//     data: { _id: user._id, email: user.email, role: user.role, isVerified: user.isVerified }
//   });
// });

// // ============================================
// // @desc    Reject/Delete unverified user
// // @route   DELETE /api/alumni/reject/:userId
// // @access  Private (Alumni)
// // ============================================
// const rejectUser = asyncHandler(async (req, res) => {
//   const { userId } = req.params;

//   const user = await User.findById(userId);
//   if (!user) throw new ErrorResponse('User not found', 404);
//   if (user.isVerified) throw new ErrorResponse('Cannot delete verified user', 400);

//   if (user.role === 'student') await Student.deleteOne({ userId: user._id });
//   else if (user.role === 'company') await Company.deleteOne({ userId: user._id });

//   await User.deleteOne({ _id: userId });

//   res.status(200).json({
//     success: true,
//     message: 'User rejected and removed successfully'
//   });
// });

// // ============================================
// // @desc    Broadcast message to all students
// // @route   POST /api/alumni/broadcast
// // @access  Private (Alumni)
// // ============================================
// const broadcastMessage = asyncHandler(async (req, res) => {
//   const { title, message, targetBranches, targetYears } = req.body;

//   if (!title || !message) throw new ErrorResponse('Please provide title and message', 400);

//   await Notification.create({
//     title,
//     message,
//     type: 'broadcast',
//     senderId: req.user._id,
//     senderRole: 'tpo',
//     isGlobal: true,
//     targetBranches: targetBranches || [],
//     targetYears: targetYears || [],
//     targetRoles: ['student']
//   });

//   res.status(200).json({
//     success: true,
//     message: 'Broadcast sent to all students'
//   });
// });

// // ============================================
// // @desc    Get analytics
// // @route   GET /api/alumni/analytics
// // @access  Private (Alumni)
// // ============================================
// const getAnalytics = asyncHandler(async (req, res) => {
//   const branchStats = await Student.aggregate([
//     { $group: { _id: '$personalInfo.branch', count: { $sum: 1 } } }
//   ]);

//   const placedApps = await Application.find({ status: 'placed' }).distinct('studentId');
//   const totalStudents = await User.countDocuments({ role: 'student' });

//   res.status(200).json({
//     success: true,
//     data: {
//       branchStats,
//       placementRate: totalStudents > 0 ? Math.round((placedApps.length / totalStudents) * 100) : 0,
//       totalPlaced: placedApps.length
//     }
//   });
// });

// module.exports = {
//   getDashboardStats,
//   getAllStudents,
//   getAllCompanies,
//   getPendingVerifications,
//   verifyUser,
//   rejectUser,
//   broadcastMessage,
//   getAnalytics
// };

const asyncHandler = require('express-async-handler');
const Referral = require('../models/Referral');
const AlumniProfile = require('../models/AlumniProfile');
const Student = require('../models/Student');
const User = require('../models/User');  // ← IMPORTANT: Add this import
const { ErrorResponse } = require('../middleware/errorMiddleware');

// ============================================
// @desc    Get Alumni Profile
// @route   GET /api/alumni/profile
// @access  Private (Alumni)
// ============================================
const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await AlumniProfile.findOne({ userId: req.user._id });

  if (!profile) {
    throw new ErrorResponse('Profile not found', 404);
  }

  res.status(200).json({
    success: true,
    data: profile
  });
});

// ============================================
// @desc    Update Alumni Profile — FIXED
// @route   PUT /api/alumni/profile
// @access  Private (Alumni)
// ============================================
const updateMyProfile = asyncHandler(async (req, res) => {
  const { company, role, batch, branch, willingToRefer, mentorshipAvailable } = req.body;

  const updateData = {};

  // ✅ Empty string bhi allow karo (field clear karne ke liye)
  if (company !== undefined) updateData.company = company;
  if (role !== undefined) updateData.role = role;
  if (batch !== undefined && batch !== '') updateData.batch = parseInt(batch);
  else if (batch === '' || batch === null) updateData.batch = null;
  if (branch !== undefined) updateData.branch = branch;
  if (willingToRefer !== undefined) updateData.willingToRefer = willingToRefer;
  if (mentorshipAvailable !== undefined) updateData.mentorshipAvailable = mentorshipAvailable;

  // ✅ findOneAndUpdate use karo taaki fresh data mile
  const profile = await AlumniProfile.findOneAndUpdate(
    { userId: req.user._id },
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!profile) {
    throw new ErrorResponse('Profile not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: profile
  });
});

// ============================================
// @desc    Get Incoming Referral Requests — FIXED
// @route   GET /api/alumni/referrals
// @access  Private (Alumni)
// ============================================
const getReferrals = asyncHandler(async (req, res) => {
  // Pehle bas referrals lao bina populate ke
  const referrals = await Referral.find({ alumniId: req.user._id })
    .sort({ createdAt: -1 });

  // ✅ Ab manually student info fetch karo (populate issue fix)
  const enrichedReferrals = await Promise.all(
    referrals.map(async (ref) => {
      const refObj = ref.toObject();

      // Student ka email lao
      const studentUser = await User.findById(ref.studentId).select('email');
      refObj.studentEmail = studentUser?.email || 'Unknown';

      // Student ka profile lao (name, branch, year)
      const studentProfile = await Student.findOne({ userId: ref.studentId })
        .select('personalInfo.name personalInfo.branch personalInfo.year');
      
      refObj.studentName = studentProfile?.personalInfo?.name || 'Unknown Student';
      refObj.studentBranch = studentProfile?.personalInfo?.branch || '';
      refObj.studentYear = studentProfile?.personalInfo?.year || '';

      return refObj;
    })
  );

  res.status(200).json({
    success: true,
    count: enrichedReferrals.length,
    data: enrichedReferrals
  });
});

// ============================================
// @desc    Respond to Referral
// @route   PUT /api/alumni/referrals/:referralId
// @access  Private (Alumni)
// ============================================
const respondToReferral = asyncHandler(async (req, res) => {
  const { referralId } = req.params;
  const { status, response } = req.body;

  if (!['accepted', 'rejected'].includes(status)) {
    throw new ErrorResponse('Status must be accepted or rejected', 400);
  }

  const referral = await Referral.findOne({ _id: referralId, alumniId: req.user._id });

  if (!referral) {
    throw new ErrorResponse('Referral not found', 404);
  }

  referral.status = status;
  if (response !== undefined) referral.alumniResponse = response;
  await referral.save();

  res.status(200).json({
    success: true,
    message: `Referral ${status}`,
    data: referral
  });
});

module.exports = {
  getMyProfile,
  updateMyProfile,
  getReferrals,
  respondToReferral
};