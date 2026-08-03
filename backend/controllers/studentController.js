// const asyncHandler = require('express-async-handler');
// const Student = require('../models/Student');
// const Job = require('../models/Job');
// const Application = require('../models/Application');
// const { ErrorResponse } = require('../middleware/errorMiddleware');
// const fs = require('fs');
// const path = require('path');

// // ============================================
// // @desc    Get student profile
// // @route   GET /api/students/profile
// // @access  Private (Student only)
// // ============================================
// const getProfile = asyncHandler(async (req, res) => {
//   const student = await Student.findOne({ userId: req.user._id });

//   if (!student) {
//     throw new ErrorResponse('Student profile not found', 404);
//   }

//   res.status(200).json({
//     success: true,
//     data: student
//   });
// });

// // ============================================
// // @desc    Update student profile
// // @route   PUT /api/students/profile
// // @access  Private (Student only)
// // ============================================


// // ... existing code ...

// const updateProfile = asyncHandler(async (req, res) => {
//   const student = await Student.findOne({ userId: req.user._id });

//   if (!student) {
//     throw new ErrorResponse('Student profile not found', 404);
//   }

//   // Update personal info
//   if (req.body.personalInfo) {
//     student.personalInfo = {
//       ...student.personalInfo,
//       ...req.body.personalInfo
//     };
//   }

//   // Update academics
//   if (req.body.academics) {
//     student.academics = {
//       ...student.academics,
//       ...req.body.academics
//     };
//   }

//   // Update skills
//   if (req.body.skills) {
//     student.skills = req.body.skills;
//   }

//   // If new resume uploaded
//   if (req.file) {
//     // Delete old resume if exists
//     if (student.resumeUrl) {
//       const oldPath = path.join(__dirname, '..', student.resumeUrl);
//       if (fs.existsSync(oldPath)) {
//         fs.unlinkSync(oldPath);
//       }
//     }
//     student.resumeUrl = `/uploads/resumes/${req.file.filename}`;
//   }

//   await student.save();

//   res.status(200).json({
//     success: true,
//     message: 'Profile updated successfully',
//     data: student
//   });
// });

// // ============================================
// // @desc    Get recommended jobs for student
// // @route   GET /api/students/recommended-jobs
// // @access  Private (Student only)
// // ============================================
// const getRecommendedJobs = asyncHandler(async (req, res) => {
//   const student = await Student.findOne({ userId: req.user._id });

//   if (!student) {
//     throw new ErrorResponse('Student profile not found', 404);
//   }

//   // Get active jobs matching student's branch and skills
//   const jobs = await Job.find({
//     status: 'active',
//     deadline: { $gte: new Date() },
//     $or: [
//       { 'eligibility.branches': { $in: [student.personalInfo.branch, 'ALL'] } },
//       { 'eligibility.branches': { $size: 0 } }
//     ]
//   }).populate('companyId', 'name logo');

//   // Calculate match percentage for each job
//   const recommendedJobs = jobs.map(job => {
//     const requiredSkills = job.eligibility.requiredSkills || [];
//     const studentSkills = student.skills || [];
    
//     // Calculate skill match
//     let matchedSkills = 0;
//     requiredSkills.forEach(skill => {
//       if (studentSkills.some(s => s.toLowerCase() === skill.toLowerCase())) {
//         matchedSkills++;
//       }
//     });
    
//     const skillMatch = requiredSkills.length > 0 
//       ? (matchedSkills / requiredSkills.length) * 100 
//       : 100;

//     // CGPA check
//     const cgpaMatch = student.academics.cgpa >= job.eligibility.minCgpa ? 100 : 0;

//     // Backlog check
//     const backlogMatch = student.academics.backlogs <= job.eligibility.maxBacklogs ? 100 : 0;

//     // Overall match percentage
//     const matchPercentage = Math.round(
//       (skillMatch * 0.5) + (cgpaMatch * 0.3) + (backlogMatch * 0.2)
//     );

//     // Check if already applied
//     const hasApplied = false; // Will check in next query

//     return {
//       ...job.toObject(),
//       matchPercentage,
//       hasApplied
//     };
//   });

//   // Sort by match percentage
//   recommendedJobs.sort((a, b) => b.matchPercentage - a.matchPercentage);

//   res.status(200).json({
//     success: true,
//     count: recommendedJobs.length,
//     data: recommendedJobs
//   });
// });

// // ============================================
// // @desc    Get student's applications
// // @route   GET /api/students/applications
// // @access  Private (Student only)
// // ============================================
// const getApplications = asyncHandler(async (req, res) => {
//   const student = await Student.findOne({ userId: req.user._id });

//   if (!student) {
//     throw new ErrorResponse('Student profile not found', 404);
//   }

//   const applications = await Application.find({ studentId: student._id })
//     .populate({
//       path: 'jobId',
//       populate: {
//         path: 'companyId',
//         select: 'name logo'
//       }
//     })
//     .sort({ appliedAt: -1 });

//   res.status(200).json({
//     success: true,
//     count: applications.length,
//     data: applications
//   });
// });

// // ============================================
// // @desc    Apply for a job
// // @route   POST /api/students/apply/:jobId
// // @access  Private (Student only)
// // ============================================
// const applyForJob = asyncHandler(async (req, res) => {
//   const { jobId } = req.params;

//   const student = await Student.findOne({ userId: req.user._id });
//   if (!student) {
//     throw new ErrorResponse('Student profile not found', 404);
//   }

//   const job = await Job.findById(jobId);
//   if (!job) {
//     throw new ErrorResponse('Job not found', 404);
//   }

//   // Check if already applied
//   const existingApplication = await Application.findOne({
//     jobId,
//     studentId: student._id
//   });

//   if (existingApplication) {
//     throw new ErrorResponse('You have already applied for this job', 400);
//   }

//   // Check eligibility
//   if (student.academics.cgpa < job.eligibility.minCgpa) {
//     throw new ErrorResponse(`Minimum CGPA required: ${job.eligibility.minCgpa}`, 400);
//   }

//   if (student.academics.backlogs > job.eligibility.maxBacklogs) {
//     throw new ErrorResponse(`Maximum backlogs allowed: ${job.eligibility.maxBacklogs}`, 400);
//   }

//   // Calculate match percentage
//   const requiredSkills = job.eligibility.requiredSkills || [];
//   const studentSkills = student.skills || [];
//   let matchedSkills = 0;
//   requiredSkills.forEach(skill => {
//     if (studentSkills.some(s => s.toLowerCase() === skill.toLowerCase())) {
//       matchedSkills++;
//     }
//   });
  
//   const skillMatch = requiredSkills.length > 0 
//     ? (matchedSkills / requiredSkills.length) * 100 
//     : 100;
//   const cgpaMatch = student.academics.cgpa >= job.eligibility.minCgpa ? 100 : 0;
//   const backlogMatch = student.academics.backlogs <= job.eligibility.maxBacklogs ? 100 : 0;
//   const matchPercentage = Math.round(
//     (skillMatch * 0.5) + (cgpaMatch * 0.3) + (backlogMatch * 0.2)
//   );

//   // Create application
//   const application = await Application.create({
//     jobId,
//     studentId: student._id,
//     status: 'applied',
//     matchPercentage,
//     appliedAt: new Date()
//   });

//   res.status(201).json({
//     success: true,
//     message: 'Application submitted successfully',
//     data: application
//   });
// });

// // ============================================
// // @desc    Get placement probability
// // @route   GET /api/students/placement-probability
// // @access  Private (Student only)
// // ============================================
// const getPlacementProbability = asyncHandler(async (req, res) => {
//   const student = await Student.findOne({ userId: req.user._id });

//   if (!student) {
//     throw new ErrorResponse('Student profile not found', 404);
//   }

//   // Simple algorithm based on profile strength
//   let score = 0;
//   let maxScore = 100;

//   // CGPA (max 30 points)
//   score += Math.min(student.academics.cgpa * 3, 30);

//   // Skills (max 25 points)
//   score += Math.min(student.skills.length * 5, 25);

//   // No backlogs (max 20 points)
//   if (student.academics.backlogs === 0) score += 20;
//   else if (student.academics.backlogs <= 2) score += 10;

//   // Resume uploaded (max 15 points)
//   if (student.resumeUrl) score += 15;

//   // Profile complete (max 10 points)
//   if (student.personalInfo.name && student.personalInfo.rollNumber) score += 10;

//   const probability = Math.round(score);

//   // Suggestions
//   const suggestions = [];
//   if (student.academics.cgpa < 8) {
//     suggestions.push('Improve your CGPA to 8+ for better opportunities');
//   }
//   if (student.skills.length < 5) {
//     suggestions.push('Learn more technical skills (aim for 5+)');
//   }
//   if (student.academics.backlogs > 0) {
//     suggestions.push('Clear your backlogs as soon as possible');
//   }
//   if (!student.resumeUrl) {
//     suggestions.push('Upload your resume for better visibility');
//   }

//   res.status(200).json({
//     success: true,
//     data: {
//       probability,
//       score,
//       maxScore,
//       suggestions
//     }
//   });
// });

// module.exports = {
//   getProfile,
//   updateProfile,
//   getRecommendedJobs,
//   getApplications,
//   applyForJob,
//   getPlacementProbability
// };
const asyncHandler = require('express-async-handler');
const Student = require('../models/Student');
const User = require('../models/User');
const { ErrorResponse } = require('../middleware/errorMiddleware');
const Referral = require('../models/Referral');
const AlumniProfile = require('../models/AlumniProfile');

// ============================================
// @desc    Get student profile
// @route   GET /api/students/profile
// @access  Private (Student)
// ============================================
const getProfile = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ userId: req.user._id });

  if (!student) {
    throw new ErrorResponse('Student profile not found', 404);
  }

  res.status(200).json({
    success: true,
    data: student
  });
});

// ============================================
// @desc    Update student profile
// @route   PUT /api/students/profile
// @access  Private (Student)
// ============================================
const updateProfile = asyncHandler(async (req, res) => {
  const { 
    name, 
    phone, 
    branch, 
    year, 
    rollNumber, 
    cgpa, 
    tenthPercentage, 
    twelfthPercentage,
    skills 
  } = req.body;

  const student = await Student.findOne({ userId: req.user._id });

  if (!student) {
    throw new ErrorResponse('Student profile not found', 404);
  }

  // Update personal info
  if (name) student.personalInfo.name = name;
  if (phone) student.personalInfo.phone = phone;
  if (branch) student.personalInfo.branch = branch;
  if (year) student.personalInfo.year = parseInt(year);
  if (rollNumber) student.personalInfo.rollNumber = rollNumber;

  // Update academics
  if (cgpa !== undefined && cgpa !== '') student.academics.cgpa = parseFloat(cgpa);
  if (tenthPercentage !== undefined && tenthPercentage !== '') student.academics.tenthPercent = parseFloat(tenthPercentage);
  if (twelfthPercentage !== undefined && twelfthPercentage !== '') student.academics.twelfthPercent = parseFloat(twelfthPercentage);

  // Update skills
  if (skills) {
    student.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()).filter(s => s);
  }

  // Update resume if uploaded
  if (req.file) {
    student.resumeUrl = `/uploads/resumes/${req.file.filename}`;
    student.resumeFileName = req.file.originalname;
  }

  // ✅ AUTO-CHECK: Profile complete hai ya nahi
  const isComplete = !!(
    student.personalInfo.name &&
    student.personalInfo.branch &&
    student.personalInfo.year &&
    student.personalInfo.rollNumber &&
    student.academics.cgpa > 0 &&
    student.academics.tenthPercent > 0 &&
    student.academics.twelfthPercent > 0
  );

  student.profileCompleted = isComplete;

  await student.save();

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: student
  });
});

// ============================================
// @desc    Check if profile is complete
// @route   GET /api/students/profile-status
// @access  Private (Student)
// ============================================
const getProfileStatus = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ userId: req.user._id });

  if (!student) {
    throw new ErrorResponse('Student profile not found', 404);
  }

  // ✅ Proper check
  const isComplete = !!(
    student.personalInfo.branch &&
    student.personalInfo.year &&
    student.personalInfo.rollNumber &&
    student.academics.cgpa > 0 &&
    student.academics.tenthPercent > 0 &&
    student.academics.twelfthPercent > 0
  );

  // Update flag if mismatch
  if (student.profileCompleted !== isComplete) {
    student.profileCompleted = isComplete;
    await student.save();
  }

  const missingFields = [];
  if (!student.personalInfo.branch) missingFields.push('branch');
  if (!student.personalInfo.year) missingFields.push('year');
  if (!student.personalInfo.rollNumber) missingFields.push('rollNumber');
  if (!student.academics.cgpa || student.academics.cgpa === 0) missingFields.push('cgpa');
  if (!student.academics.tenthPercent || student.academics.tenthPercent === 0) missingFields.push('tenthPercentage');
  if (!student.academics.twelfthPercent || student.academics.twelfthPercent === 0) missingFields.push('twelfthPercentage');

  res.status(200).json({
    success: true,
    data: {
      isComplete,
      missingFields,
      profile: student
    }
  });
});

// ============================================
// @desc    Get student's applications
// @route   GET /api/students/applications
// @access  Private (Student)
// ============================================
const getApplications = asyncHandler(async (req, res) => {
  const Application = require('../models/Application');
  
  const applications = await Application.find({ studentId: req.user._id })
    .populate('jobId', 'title companyId package location')
    .populate('jobId.companyId', 'name')
    .sort({ appliedAt: -1 });

  res.status(200).json({
    success: true,
    count: applications.length,
    data: applications
  });
});

// ============================================
// @desc    Apply for a job
// @route   POST /api/students/apply/:jobId
// @access  Private (Student)
// ============================================
const applyForJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const Application = require('../models/Application');
  const Job = require('../models/Job');

  // Check if job exists and is active
  const job = await Job.findById(jobId);
  if (!job) {
    throw new ErrorResponse('Job not found', 404);
  }
  if (job.status !== 'active') {
    throw new ErrorResponse('This job is no longer accepting applications', 400);
  }

  // Check if already applied
  const alreadyApplied = await Application.findOne({
    studentId: req.user._id,
    jobId: jobId
  });

  if (alreadyApplied) {
    throw new ErrorResponse('You have already applied for this job', 400);
  }

  // Check eligibility
  const student = await Student.findOne({ userId: req.user._id });
  if (!student) {
    throw new ErrorResponse('Student profile not found', 404);
  }

  // ✅ Check if profile is complete enough to apply
  const isProfileComplete = !!(
    student.personalInfo.branch &&
    student.personalInfo.year &&
    student.personalInfo.rollNumber &&
    student.academics.cgpa > 0 &&
    student.academics.tenthPercent > 0 &&
    student.academics.twelfthPercent > 0
  );

  if (!isProfileComplete) {
    throw new ErrorResponse('Please complete your profile before applying', 400);
  }

  // Check CGPA criteria
  if (job.eligibility?.minCgpa && student.academics.cgpa < job.eligibility.minCgpa) {
    throw new ErrorResponse(`Minimum CGPA required: ${job.eligibility.minCgpa}`, 403);
  }

  // Check branch criteria
  if (job.eligibility?.branches?.length > 0) {
    if (!job.eligibility.branches.includes(student.personalInfo.branch)) {
      throw new ErrorResponse('Your branch is not eligible for this job', 403);
    }
  }

  // Check backlogs
  if (job.eligibility?.maxBacklogs !== undefined && student.academics.backlogs > job.eligibility.maxBacklogs) {
    throw new ErrorResponse(`Maximum ${job.eligibility.maxBacklogs} backlogs allowed`, 403);
  }

  const application = await Application.create({
    studentId: req.user._id,
    jobId: jobId,
    status: 'applied',
    appliedAt: new Date()
  });

  res.status(201).json({
    success: true,
    message: 'Application submitted successfully',
    data: application
  });
});

// ============================================
// @desc    Get recommended jobs
// @route   GET /api/students/recommended-jobs
// @access  Private (Student)
// ============================================
const getRecommendedJobs = asyncHandler(async (req, res) => {
  const Job = require('../models/Job');
  const student = await Student.findOne({ userId: req.user._id });
  
  let query = { status: 'active' };
  
  // If student has branch, filter by eligible branches
  if (student?.personalInfo?.branch) {
    query.$or = [
      { 'eligibility.branches': { $in: [student.personalInfo.branch] } },
      { 'eligibility.branches': { $size: 0 } },
      { 'eligibility.branches': { $exists: false } }
    ];
  }

  const jobs = await Job.find(query)
    .populate('companyId', 'name logo')
    .sort({ createdAt: -1 });

  // Check which jobs student has already applied to
  const Application = require('../models/Application');
  const appliedJobs = await Application.find({ studentId: req.user._id }).select('jobId');

  const appliedJobIds = appliedJobs.map(app => app.jobId.toString());

  // Add match percentage
  const jobsWithMatch = jobs.map(job => {
    let matchPercentage = 0;
    
    if (student) {
      // CGPA match
      if (job.eligibility?.minCgpa && student.academics.cgpa >= job.eligibility.minCgpa) {
        matchPercentage += 40;
      } else if (student.academics.cgpa > 0) {
        matchPercentage += Math.min(40, (student.academics.cgpa / (job.eligibility?.minCgpa || 10)) * 40);
      }
      
      // Skills match
      if (job.eligibility?.requiredSkills?.length > 0 && student.skills?.length > 0) {
        const matchedSkills = job.eligibility.requiredSkills.filter(skill => 
          student.skills.some(s => s.toLowerCase() === skill.toLowerCase())
        );
        matchPercentage += (matchedSkills.length / job.eligibility.requiredSkills.length) * 40;
      } else {
        matchPercentage += 40;
      }
      
      // Branch match
      if (!job.eligibility?.branches?.length || job.eligibility.branches.includes(student.personalInfo.branch)) {
        matchPercentage += 20;
      }
    }

    return {
      ...job.toObject(),
      matchPercentage: Math.round(matchPercentage),
      hasApplied: appliedJobIds.includes(job._id.toString())
    };
  });

  res.status(200).json({
    success: true,
    count: jobsWithMatch.length,
    data: jobsWithMatch
  });
});

// ============================================
// @desc    Get placement probability
// @route   GET /api/students/placement-probability
// @access  Private (Student)
// ============================================
const getPlacementProbability = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ userId: req.user._id });

  if (!student) {
    throw new ErrorResponse('Student profile not found', 404);
  }

  let score = 0;
  let maxScore = 100;
  const suggestions = [];

  // CGPA score (max 30)
  if (student.academics.cgpa >= 8) score += 30;
  else if (student.academics.cgpa >= 7) score += 20;
  else if (student.academics.cgpa > 0) score += 10;
  else suggestions.push('Add your CGPA to improve score');

  // 10th score (max 15)
  if (student.academics.tenthPercent >= 80) score += 15;
  else if (student.academics.tenthPercent >= 60) score += 10;
  else if (student.academics.tenthPercent > 0) score += 5;
  else suggestions.push('Add your 10th percentage');

  // 12th score (max 15)
  if (student.academics.twelfthPercent >= 80) score += 15;
  else if (student.academics.twelfthPercent >= 60) score += 10;
  else if (student.academics.twelfthPercent > 0) score += 5;
  else suggestions.push('Add your 12th percentage');

  // Skills score (max 20)
  if (student.skills?.length >= 5) score += 20;
  else if (student.skills?.length >= 3) score += 15;
  else if (student.skills?.length > 0) score += 10;
  else suggestions.push('Add skills to your profile');

  // Resume score (max 10)
  if (student.resumeUrl) score += 10;
  else suggestions.push('Upload your resume for better visibility');

  // Backlogs penalty
  if (student.academics.backlogs > 0) {
    score -= Math.min(score, student.academics.backlogs * 5);
    suggestions.push('Clear your backlogs to improve chances');
  }

  const probability = Math.max(0, Math.min(100, Math.round(score)));

  res.status(200).json({
    success: true,
    data: {
      probability,
      score,
      maxScore,
      suggestions: suggestions.length > 0 ? suggestions : ['Great profile! Keep applying to jobs.']
    }
  });
});

// ============================================
// NEW: Get all verified alumni list
// @route   GET /api/students/alumni
// @access  Private (Student)
// ============================================
const getAlumniList = asyncHandler(async (req, res) => {
  const alumniProfiles = await AlumniProfile.find()
    .populate('userId', 'email isVerified')
    .sort({ createdAt: -1 });

  // Filter only verified alumni
  const verifiedAlumni = alumniProfiles.filter(a => a.userId && a.userId.isVerified);

  res.status(200).json({
    success: true,
    count: verifiedAlumni.length,
    data: verifiedAlumni
  });
});

// ============================================
// NEW: Request referral from alumni
// @route   POST /api/students/referral/:alumniId
// @access  Private (Student)
// ============================================
const requestReferral = asyncHandler(async (req, res) => {
  const { alumniId } = req.params;
  const { message } = req.body;

  if (!message) {
    throw new ErrorResponse('Please provide a message', 400);
  }

  const alumni = await User.findOne({ _id: alumniId, role: 'alumni', isVerified: true });
  if (!alumni) {
    throw new ErrorResponse('Alumni not found', 404);
  }

  const referral = await Referral.create({
    studentId: req.user._id,
    alumniId: alumniId,
    message
  });

  res.status(201).json({
    success: true,
    message: 'Referral request sent successfully',
    data: referral
  });
});

// ============================================
// NEW: Get my referral requests
// @route   GET /api/students/my-referrals
// @access  Private (Student)
// ============================================
const getMyReferrals = asyncHandler(async (req, res) => {
  const referrals = await Referral.find({ studentId: req.user._id })
    .populate('alumniId', 'email')
    .populate({
      path: 'alumniId',
      populate: { path: 'alumniProfile', model: 'AlumniProfile' }
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: referrals.length,
    data: referrals
  });
});

module.exports = {
  // Existing exports
  getProfile,
  updateProfile,
  getProfileStatus,
  getApplications,
  applyForJob,
  getRecommendedJobs,
  getPlacementProbability,
  // NEW exports
  getAlumniList,
  requestReferral,
  getMyReferrals
};