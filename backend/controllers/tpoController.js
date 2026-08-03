// const asyncHandler = require('express-async-handler');
// const User = require('../models/User');
// const Student = require('../models/Student');
// const Company = require('../models/Company');
// const Job = require('../models/Job');
// const Application = require('../models/Application');
// const TPO = require('../models/TPO');
// const { ErrorResponse } = require('../middleware/errorMiddleware');

// // ============================================
// // @desc    Get TPO profile
// // @route   GET /api/tpo/profile
// // @access  Private (TPO only)
// // ============================================
// const getProfile = asyncHandler(async (req, res) => {
//   const tpo = await TPO.findOne({ userId: req.user._id });

//   if (!tpo) {
//     throw new ErrorResponse('TPO profile not found', 404);
//   }

//   res.status(200).json({
//     success: true,
//     data: tpo
//   });
// });

// // ============================================
// // @desc    Create/update TPO profile
// // @route   PUT /api/tpo/profile
// // @access  Private (TPO only)
// // ============================================
// const updateProfile = asyncHandler(async (req, res) => {
//   const { personalInfo, collegeDetails } = req.body;

//   let tpo = await TPO.findOne({ userId: req.user._id });

//   if (tpo) {
//     // Update existing profile
//     tpo = await TPO.findOneAndUpdate(
//       { userId: req.user._id },
//       { personalInfo, collegeDetails },
//       { new: true, runValidators: true }
//     );
//   } else {
//     // Create new profile
//     tpo = await TPO.create({
//       userId: req.user._id,
//       personalInfo,
//       collegeDetails
//     });
//   }

//   res.status(200).json({
//     success: true,
//     message: 'Profile updated successfully',
//     data: tpo
//   });
// });

// // ============================================
// // @desc    Get placement analytics
// // @route   GET /api/tpo/analytics
// // @access  Private (TPO only)
// // ============================================
// const getAnalytics = asyncHandler(async (req, res) => {
//   // Total students
//   const totalStudents = await Student.countDocuments();

//   // Total companies
//   const totalCompanies = await Company.countDocuments();

//   // Total jobs
//   const totalJobs = await Job.countDocuments();

//   // Active jobs
//   const activeJobs = await Job.countDocuments({ status: 'active' });

//   // Total applications
//   const totalApplications = await Application.countDocuments();

//   // Placed students
//   const placedStudents = await Application.countDocuments({ status: 'placed' });

//   // Placement rate
//   const placementRate = totalStudents > 0 
//     ? ((placedStudents / totalStudents) * 100).toFixed(2) 
//     : 0;

//   // Branch-wise stats
//   const branchStats = await Student.aggregate([
//     {
//       $group: {
//         _id: '$personalInfo.branch',
//         total: { $sum: 1 },
//         avgCgpa: { $avg: '$academics.cgpa' }
//       }
//     },
//     {
//       $sort: { total: -1 }
//     }
//   ]);

//   // Company-wise stats
//   const companyStats = await Application.aggregate([
//     {
//       $match: { status: 'placed' }
//     },
//     {
//       $lookup: {
//         from: 'jobs',
//         localField: 'jobId',
//         foreignField: '_id',
//         as: 'job'
//       }
//     },
//     {
//       $unwind: '$job'
//     },
//     {
//       $lookup: {
//         from: 'companies',
//         localField: 'job.companyId',
//         foreignField: '_id',
//         as: 'company'
//       }
//     },
//     {
//       $unwind: '$company'
//     },
//     {
//       $group: {
//         _id: '$company.name',
//         totalHired: { $sum: 1 },
//         avgPackage: { $avg: '$job.package' }
//       }
//     },
//     {
//       $sort: { totalHired: -1 }
//     }
//   ]);

//   res.status(200).json({
//     success: true,
//     data: {
//       overview: {
//         totalStudents,
//         totalCompanies,
//         totalJobs,
//         activeJobs,
//         totalApplications,
//         placedStudents,
//         placementRate
//       },
//       branchStats,
//       companyStats
//     }
//   });
// });

// // ============================================
// // @desc    Get all students with filters
// // @route   GET /api/tpo/students
// // @access  Private (TPO only)
// // ============================================
// const getStudents = asyncHandler(async (req, res) => {
//   const { branch, minCgpa, maxBacklogs, skills, year, placed } = req.query;

//   let query = {};

//   // Branch filter
//   if (branch) {
//     query['personalInfo.branch'] = branch;
//   }

//   // Year filter
//   if (year) {
//     query['personalInfo.year'] = parseInt(year);
//   }

//   // CGPA filter
//   if (minCgpa) {
//     query['academics.cgpa'] = { $gte: parseFloat(minCgpa) };
//   }

//   // Backlogs filter
//   if (maxBacklogs !== undefined) {
//     query['academics.backlogs'] = { $lte: parseInt(maxBacklogs) };
//   }

//   // Skills filter (comma separated)
//   if (skills) {
//     const skillsArray = skills.split(',').map(s => s.trim());
//     query.skills = { $in: skillsArray };
//   }

//   // Placement status filter
//   if (placed === 'true') {
//     // Students with at least one placed application
//     const placedStudentIds = await Application.find({ status: 'placed' }).distinct('studentId');
//     query.userId = { $in: placedStudentIds };
//   } else if (placed === 'false') {
//     // Students with no placed applications
//     const placedStudentIds = await Application.find({ status: 'placed' }).distinct('studentId');
//     query.userId = { $nin: placedStudentIds };
//   }

//   const students = await Student.find(query)
//     .populate('userId', 'email isVerified')
//     .sort({ 'academics.cgpa': -1 });

//   res.status(200).json({
//     success: true,
//     count: students.length,
//     data: students
//   });
// });

// // ============================================
// // @desc    Get all companies
// // @route   GET /api/tpo/companies
// // @access  Private (TPO only)
// // ============================================
// const getCompanies = asyncHandler(async (req, res) => {
//   const { verified, search } = req.query;

//   let query = {};

//   // Verification filter
//   if (verified !== undefined) {
//     const userIds = await User.find({ isVerified: verified === 'true' }).distinct('_id');
//     query.userId = { $in: userIds };
//   }

//   // Search by name
//   if (search) {
//     query.name = { $regex: search, $options: 'i' };
//   }

//   const companies = await Company.find(query)
//     .populate('userId', 'email isVerified')
//     .sort({ createdAt: -1 });

//   res.status(200).json({
//     success: true,
//     count: companies.length,
//     data: companies
//   });
// });

// // ============================================
// // @desc    Broadcast notification to all students
// // @route   POST /api/tpo/broadcast
// // @access  Private (TPO only)
// // ============================================
// const broadcastNotification = asyncHandler(async (req, res) => {
//   const { title, message, type, targetBranches, targetYears } = req.body;

//   if (!title || !message) {
//     throw new ErrorResponse('Please provide title and message', 400);
//   }

//   // Build target query
//   let studentQuery = {};

//   if (targetBranches) {
//     const branches = targetBranches.split(',').map(b => b.trim());
//     studentQuery['personalInfo.branch'] = { $in: branches };
//   }

//   if (targetYears) {
//     const years = targetYears.split(',').map(y => parseInt(y.trim()));
//     studentQuery['personalInfo.year'] = { $in: years };
//   }

//   // Get target students
//   const targetStudents = await Student.find(studentQuery).select('userId');
//   const userIds = targetStudents.map(s => s.userId);

//   // Create notifications
//   const Notification = require('../models/Notification');
//   const notifications = userIds.map(userId => ({
//     userId,
//     type: type || 'broadcast',
//     title,
//     message,
//     isRead: false
//   }));

//   await Notification.insertMany(notifications);

//   res.status(200).json({
//     success: true,
//     message: `Notification sent to ${userIds.length} students`,
//     data: {
//       recipientsCount: userIds.length
//     }
//   });
// });

// // ============================================
// // @desc    Get recent placements
// // @route   GET /api/tpo/placements
// // @access  Private (TPO only)
// // ============================================
// const getPlacements = asyncHandler(async (req, res) => {
//   const { limit = 20, page = 1 } = req.query;

//   const placements = await Application.find({ status: 'placed' })
//     .populate('studentId', 'personalInfo.name personalInfo.branch')
//     .populate({
//       path: 'jobId',
//       populate: {
//         path: 'companyId',
//         select: 'name'
//       }
//     })
//     .sort({ updatedAt: -1 })
//     .limit(parseInt(limit))
//     .skip((parseInt(page) - 1) * parseInt(limit));

//   const total = await Application.countDocuments({ status: 'placed' });

//   res.status(200).json({
//     success: true,
//     count: placements.length,
//     total,
//     page: parseInt(page),
//     pages: Math.ceil(total / parseInt(limit)),
//     data: placements
//   });
// });

// module.exports = {
//   getProfile,
//   updateProfile,
//   getAnalytics,
//   getStudents,
//   getCompanies,
//   broadcastNotification,
//   getPlacements
// };
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Student = require('../models/Student');
const Company = require('../models/Company');
const AlumniProfile = require('../models/AlumniProfile');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Notification = require('../models/Notification');
const { ErrorResponse } = require('../middleware/errorMiddleware');

// ============================================
// NEW: Dashboard Stats (with Alumni count)
// ============================================
const getDashboardStats = asyncHandler(async (req, res) => {
  const totalStudents = await User.countDocuments({ role: 'student' });
  const totalCompanies = await User.countDocuments({ role: 'company' });
  const totalAlumni = await User.countDocuments({ role: 'alumni' });
  const pendingVerifications = await User.countDocuments({ isVerified: false });

  const placedApps = await Application.find({ status: 'placed' }).distinct('studentId');

  res.status(200).json({
    success: true,
    data: {
      totalStudents,
      totalCompanies,
      totalAlumni,
      pendingVerifications,
      placedCount: placedApps.length
    }
  });
});

// ============================================
// NEW: Pending Verifications (with Alumni support)
// ============================================
const getPendingVerifications = asyncHandler(async (req, res) => {
  const pendingUsers = await User.find({ isVerified: false })
    .select('-password')
    .sort({ createdAt: -1 });

  const usersWithProfile = await Promise.all(
    pendingUsers.map(async (user) => {
      let profile = null;
      if (user.role === 'student') {
        profile = await Student.findOne({ userId: user._id }).select('personalInfo');
      } else if (user.role === 'company') {
        profile = await Company.findOne({ userId: user._id }).select('name');
      } else if (user.role === 'alumni') {
        profile = await AlumniProfile.findOne({ userId: user._id }).select('name company role');
      }
      return { ...user.toObject(), profile };
    })
  );

  res.status(200).json({
    success: true,
    count: usersWithProfile.length,
    data: usersWithProfile
  });
});

// ============================================
// NEW: Verify User (Student/Company/Alumni)
// ============================================
const verifyUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  
  if (!user) throw new ErrorResponse('User not found', 404);
  if (user.isVerified) throw new ErrorResponse('Already verified', 400);

  user.isVerified = true;
  await user.save();

  res.status(200).json({
    success: true,
    message: `${user.role} verified successfully`
  });
});

// ============================================
// NEW: Reject/Delete User
// ============================================
const rejectUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  
  if (!user) throw new ErrorResponse('User not found', 404);
  if (user.isVerified) throw new ErrorResponse('Cannot delete verified user', 400);

  if (user.role === 'student') await Student.deleteOne({ userId: user._id });
  else if (user.role === 'company') await Company.deleteOne({ userId: user._id });
  else if (user.role === 'alumni') await AlumniProfile.deleteOne({ userId: user._id });

  await User.deleteOne({ _id: userId });

  res.status(200).json({
    success: true,
    message: 'User rejected successfully'
  });
});

// ============================================
// EXISTING: Get TPO profile
// ============================================
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.status(200).json({ success: true, data: user });
});

// ============================================
// EXISTING: Update TPO profile
// ============================================
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: req.body },
    { new: true, runValidators: true }
  ).select('-password');
  res.status(200).json({ success: true, data: user });
});

// ============================================
// EXISTING: Get analytics overview
// ============================================
const getAnalytics = asyncHandler(async (req, res) => {
  const totalStudents = await Student.countDocuments();
  const totalCompanies = await Company.countDocuments();
  const activeJobs = await Job.countDocuments({ status: 'active' });
  const placedStudents = await Student.countDocuments({ placementStatus: 'placed' });
  const placementRate = totalStudents > 0 ? ((placedStudents / totalStudents) * 100).toFixed(2) : 0;

  const placements = await Application.find({ status: 'placed' }).populate('jobId');
  let avgPackage = 0;
  if (placements.length > 0) {
    avgPackage = (placements.reduce((sum, p) => sum + (p.jobId?.package || 0), 0) / placements.length).toFixed(1);
  }

  const branchStats = await Student.aggregate([
    {
      $group: {
        _id: '$personalInfo.branch',
        total: { $sum: 1 },
        placed: { $sum: { $cond: [{ $eq: ['$placementStatus', 'placed'] }, 1, 0] } },
        avgCgpa: { $avg: '$academics.cgpa' }
      }
    }
  ]);

  const companyStats = await Application.aggregate([
    { $match: { status: 'placed' } },
    {
      $lookup: {
        from: 'jobs',
        localField: 'jobId',
        foreignField: '_id',
        as: 'job'
      }
    },
    { $unwind: '$job' },
    {
      $lookup: {
        from: 'companies',
        localField: 'job.companyId',
        foreignField: '_id',
        as: 'company'
      }
    },
    { $unwind: '$company' },
    {
      $group: {
        _id: '$company.name',
        totalHired: { $sum: 1 },
        avgPackage: { $avg: '$job.package' }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: {
      overview: {
        totalStudents,
        totalCompanies,
        activeJobs,
        placedStudents,
        placementRate,
        avgPackage
      },
      branchStats,
      companyStats
    }
  });
});

// ============================================
// EXISTING: Get all students with filters
// ============================================
const getStudents = asyncHandler(async (req, res) => {
  const { branch, minCgpa, placementStatus, search } = req.query;
  
  let query = {};
  
  if (branch) query['personalInfo.branch'] = branch;
  if (minCgpa) query['academics.cgpa'] = { $gte: parseFloat(minCgpa) };
  if (placementStatus) query.placementStatus = placementStatus;
  if (search) {
    query.$or = [
      { 'personalInfo.name': { $regex: search, $options: 'i' } },
      { 'personalInfo.email': { $regex: search, $options: 'i' } },
      { 'personalInfo.rollNumber': { $regex: search, $options: 'i' } }
    ];
  }

  const students = await Student.find(query)
    .populate('userId', 'email isVerified')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: students.length,
    data: students
  });
});

// ============================================
// EXISTING: Get all companies
// ============================================
const getCompanies = asyncHandler(async (req, res) => {
  const { search } = req.query;
  
  let query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const companies = await Company.find(query)
    .populate('userId', 'email isVerified createdAt')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: companies.length,
    data: companies
  });
});

// ============================================
// EXISTING: Get all jobs (TPO view)
// ============================================
const getJobs = asyncHandler(async (req, res) => {
  const { status, companyId } = req.query;
  
  let query = {};
  if (status) query.status = status;
  if (companyId) query.companyId = companyId;

  const jobs = await Job.find(query)
    .populate('companyId', 'name')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: jobs.length,
    data: jobs
  });
});

// ============================================
// EXISTING: Broadcast notification
// ============================================
const broadcast = asyncHandler(async (req, res) => {
  const { title, message, type, targetBranches, targetYears } = req.body;

  if (!title || !message) {
    throw new ErrorResponse('Title and message are required', 400);
  }

  const branches = targetBranches 
    ? targetBranches.split(',').map(s => s.trim()).filter(s => s) 
    : [];
  const years = targetYears 
    ? targetYears.split(',').map(s => s.trim()).filter(s => s) 
    : [];

  const notification = await Notification.create({
    title,
    message,
    type: type || 'broadcast',
    senderRole: 'tpo',
    senderId: req.user._id,
    targetBranches: branches,
    targetYears: years,
    targetRoles: ['student'],
    isGlobal: branches.length === 0 && years.length === 0
  });

  res.status(201).json({
    success: true,
    message: 'Broadcast sent successfully',
    data: notification
  });
});

// ============================================
// EXISTING: Get recent placements
// ============================================
const getPlacements = asyncHandler(async (req, res) => {
  const placements = await Application.find({ status: 'placed' })
    .populate({
      path: 'studentId',
      select: 'personalInfo.name personalInfo.branch'
    })
    .populate({
      path: 'jobId',
      select: 'package companyId title',
      populate: {
        path: 'companyId',
        select: 'name'
      }
    })
    .sort({ updatedAt: -1 })
    .limit(20);

  res.status(200).json({
    success: true,
    count: placements.length,
    data: placements
  });
});

module.exports = {
  // NEW exports
  getDashboardStats,
  getPendingVerifications,
  verifyUser,
  rejectUser,
  // EXISTING exports
  getProfile,
  updateProfile,
  getAnalytics,
  getStudents,
  getCompanies,
  getJobs,
  broadcast,
  getPlacements
};