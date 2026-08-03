const asyncHandler = require('express-async-handler');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Student = require('../models/Student');
const { ErrorResponse } = require('../middleware/errorMiddleware');

// Helper: Get or create company profile
const getOrCreateCompany = async (userId) => {
  let company = await Company.findOne({ userId });
  if (!company) {
    // Auto-create basic company profile if missing
    company = await Company.create({
      userId,
      name: 'My Company',
      description: '',
      website: '',
      logo: ''
    });
  }
  return company;
};

// ============================================
// @desc    Get company profile
// @route   GET /api/companies/profile
// @access  Private (Company only)
// ============================================
const getProfile = asyncHandler(async (req, res) => {
  const company = await getOrCreateCompany(req.user._id);

  res.status(200).json({
    success: true,
    data: company
  });
});

// ============================================
// @desc    Update company profile
// @route   PUT /api/companies/profile
// @access  Private (Company only)
// ============================================
const updateProfile = asyncHandler(async (req, res) => {
  const { name, description, website, logo } = req.body;

  let company = await Company.findOne({ userId: req.user._id });
  if (!company) {
    company = await Company.create({
      userId: req.user._id,
      name: name || 'My Company',
      description: description || '',
      website: website || '',
      logo: logo || ''
    });
  } else {
    company = await Company.findOneAndUpdate(
      { userId: req.user._id },
      { name, description, website, logo },
      { new: true, runValidators: true }
    );
  }

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: company
  });
});

// ============================================
// @desc    Get company dashboard stats
// @route   GET /api/companies/dashboard-stats
// @access  Private (Company only)
// ============================================
const getDashboardStats = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ userId: req.user._id });

  // ⚠️ Agar company profile nahi hai, empty stats return karo (error mat do)
  if (!company) {
    return res.status(200).json({
      success: true,
      data: {
        totalJobs: 0,
        activeJobs: 0,
        totalApplications: 0,
        shortlisted: 0,
        interviews: 0,
        hired: 0,
        avgPackage: 0
      }
    });
  }

  const jobs = await Job.find({ companyId: company._id });
  const jobIds = jobs.map(job => job._id);

  const totalApplications = await Application.countDocuments({ jobId: { $in: jobIds } });
  const shortlisted = await Application.countDocuments({ jobId: { $in: jobIds }, status: 'shortlisted' });
  const hired = await Application.countDocuments({ jobId: { $in: jobIds }, status: 'placed' });
  const interviews = await Application.countDocuments({ jobId: { $in: jobIds }, status: 'interview' });

  const avgPackage = jobs.length > 0 
    ? (jobs.reduce((sum, job) => sum + job.package, 0) / jobs.length).toFixed(1)
    : 0;

  res.status(200).json({
    success: true,
    data: {
      totalJobs: jobs.length,
      activeJobs: jobs.filter(j => j.status === 'active').length,
      totalApplications,
      shortlisted,
      interviews,
      hired,
      avgPackage
    }
  });
});

// ============================================
// @desc    Get applicants for a job with AI ranking
// @route   GET /api/companies/jobs/:jobId/applicants
// @access  Private (Company only)
// ============================================
const getJobApplicants = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  const company = await Company.findOne({ userId: req.user._id });
  if (!company) {
    throw new ErrorResponse('Company profile not found. Please complete your profile first.', 404);
  }

  const job = await Job.findById(jobId);
  if (!job) {
    throw new ErrorResponse('Job not found', 404);
  }

  if (job.companyId.toString() !== company._id.toString()) {
    throw new ErrorResponse('Not authorized to view this job', 403);
  }

  const applications = await Application.find({ jobId })
    .populate({
      path: 'studentId',
      select: 'personalInfo.name personalInfo.email personalInfo.branch academics.cgpa skills resumeUrl resumeText'
  })
  .sort({ matchPercentage: -1, appliedAt: -1 });

  const applicants = applications.map(app => ({
    _id: app._id,
    studentId: app.studentId?._id,
    name: app.studentId?.personalInfo?.name || 'Unknown',
    email: app.studentId?.personalInfo?.email || 'N/A',
    branch: app.studentId?.personalInfo?.branch || 'N/A',
    cgpa: app.studentId?.academics?.cgpa || 0,
    skills: app.studentId?.skills || [],
    resumeUrl: app.studentId?.resumeUrl || null,  // ← Yeh add karo
    resumeText: app.studentId?.resumeText || '',  // ← Yeh bhi add karo
    matchPercentage: app.matchPercentage,
    status: app.status,
    appliedAt: app.appliedAt,
    aiRank: getAIRank(app.matchPercentage)
  }));

  res.status(200).json({
    success: true,
    count: applicants.length,
    data: applicants
  });
});

// Helper function for AI ranking
const getAIRank = (matchPercentage) => {
  if (matchPercentage >= 90) return { label: 'Excellent Match', color: 'green', score: 'A+' };
  if (matchPercentage >= 80) return { label: 'Strong Match', color: 'blue', score: 'A' };
  if (matchPercentage >= 70) return { label: 'Good Match', color: 'teal', score: 'B+' };
  if (matchPercentage >= 60) return { label: 'Average Match', color: 'yellow', score: 'B' };
  return { label: 'Below Average', color: 'red', score: 'C' };
};

// ============================================
// @desc    Update application status
// @route   PUT /api/companies/applications/:applicationId/status
// @access  Private (Company only)
// ============================================
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const { status, interviewSlot } = req.body;

  const company = await Company.findOne({ userId: req.user._id });
  if (!company) {
    throw new ErrorResponse('Company profile not found', 404);
  }

  const application = await Application.findById(applicationId).populate('jobId');
  if (!application) {
    throw new ErrorResponse('Application not found', 404);
  }

  if (application.jobId.companyId.toString() !== company._id.toString()) {
    throw new ErrorResponse('Not authorized to update this application', 403);
  }

  const validStatuses = ['applied', 'shortlisted', 'interview', 'placed', 'rejected'];
  if (!validStatuses.includes(status)) {
    throw new ErrorResponse('Invalid status', 400);
  }

  application.status = status;
  application.updatedAt = new Date();

  if (interviewSlot) {
    application.interviewSlot = {
      date: interviewSlot.date,
      time: interviewSlot.time,
      meetLink: interviewSlot.meetLink,
      isConfirmed: false
    };
  }

  await application.save();

  res.status(200).json({
    success: true,
    message: `Application ${status} successfully`,
    data: application
  });
});

// ============================================
// @desc    Schedule interview
// @route   POST /api/companies/applications/:applicationId/schedule
// @access  Private (Company only)
// ============================================
const scheduleInterview = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const { date, time, meetLink } = req.body;

  const company = await Company.findOne({ userId: req.user._id });
  if (!company) {
    throw new ErrorResponse('Company profile not found', 404);
  }

  const application = await Application.findById(applicationId).populate('jobId');
  if (!application) {
    throw new ErrorResponse('Application not found', 404);
  }

  if (application.jobId.companyId.toString() !== company._id.toString()) {
    throw new ErrorResponse('Not authorized to schedule interview', 403);
  }

  application.status = 'interview';
  application.interviewSlot = {
    date: new Date(date),
    time,
    meetLink,
    isConfirmed: false
  };
  application.updatedAt = new Date();

  await application.save();

  res.status(200).json({
    success: true,
    message: 'Interview scheduled successfully',
    data: application
  });
});

module.exports = {
  getProfile,
  updateProfile,
  getDashboardStats,
  getJobApplicants,
  updateApplicationStatus,
  scheduleInterview
};