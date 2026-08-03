const asyncHandler = require('express-async-handler');
const Job = require('../models/Job');
const Company = require('../models/Company');
const { ErrorResponse } = require('../middleware/errorMiddleware');

// Helper: Get or create company profile
const getOrCreateCompany = async (userId) => {
  let company = await Company.findOne({ userId });
  if (!company) {
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
// @desc    Create new job
// @route   POST /api/jobs
// @access  Private (Company only)
// ============================================
const createJob = asyncHandler(async (req, res) => {
  const { title, description, package, location, type, eligibility, deadline } = req.body;

  if (!title || !description || !package || !location || !type || !deadline) {
    throw new ErrorResponse('Please provide all required fields', 400);
  }

  // Auto-create company profile if missing
  const company = await getOrCreateCompany(req.user._id);

  const job = await Job.create({
    companyId: company._id,
    title,
    description,
    package,
    location,
    type,
    eligibility: {
      minCgpa: eligibility?.minCgpa || 0,
      maxBacklogs: eligibility?.maxBacklogs || 0,
      requiredSkills: eligibility?.requiredSkills || [],
      branches: eligibility?.branches || []
    },
    deadline: new Date(deadline),
    status: 'active'
  });

  res.status(201).json({
    success: true,
    message: 'Job posted successfully',
    data: job
  });
});

// ============================================
// @desc    Get all active jobs
// @route   GET /api/jobs
// @access  Public
// ============================================
const getJobs = asyncHandler(async (req, res) => {
  const { type, branch, search } = req.query;
  
  let query = { status: 'active' };

  if (type) query.type = type;
  if (branch) query['eligibility.branches'] = { $in: [branch] };
  
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const jobs = await Job.find(query)
    .populate('companyId', 'name logo')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: jobs.length,
    data: jobs
  });
});

// ============================================
// @desc    Get company's own jobs
// @route   GET /api/jobs/my-jobs
// @access  Private (Company only)
// ============================================
const getMyJobs = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ userId: req.user._id });
  
  // ⚠️ Agar company profile nahi hai, empty array return karo
  if (!company) {
    return res.status(200).json({
      success: true,
      count: 0,
      data: []
    });
  }

  const jobs = await Job.find({ companyId: company._id })
    .populate('companyId', 'name')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: jobs.length,
    data: jobs
  });
});

// ============================================
// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
// ============================================
const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id)
    .populate('companyId', 'name description logo website');

  if (!job) {
    throw new ErrorResponse('Job not found', 404);
  }

  res.status(200).json({
    success: true,
    data: job
  });
});

// ============================================
// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Company only)
// ============================================
const updateJob = asyncHandler(async (req, res) => {
  let job = await Job.findById(req.params.id);
  if (!job) throw new ErrorResponse('Job not found', 404);

  const company = await Company.findOne({ userId: req.user._id });
  if (!company) throw new ErrorResponse('Company profile not found', 404);

  if (job.companyId.toString() !== company._id.toString()) {
    throw new ErrorResponse('Not authorized to update this job', 403);
  }

  job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

  res.status(200).json({
    success: true,
    message: 'Job updated successfully',
    data: job
  });
});

// ============================================
// @desc    Delete/close job
// @route   DELETE /api/jobs/:id
// @access  Private (Company only)
// ============================================
const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw new ErrorResponse('Job not found', 404);

  const company = await Company.findOne({ userId: req.user._id });
  if (!company) throw new ErrorResponse('Company profile not found', 404);

  if (job.companyId.toString() !== company._id.toString()) {
    throw new ErrorResponse('Not authorized to delete this job', 403);
  }

  job.status = 'closed';
  await job.save();

  res.status(200).json({
    success: true,
    message: 'Job closed successfully',
    data: {}
  });
});

// ============================================
// @desc    Get job applicants
// @route   GET /api/jobs/:id/applicants
// @access  Private (Company only)
// ============================================
const getJobApplicants = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) throw new ErrorResponse('Job not found', 404);

  const company = await Company.findOne({ userId: req.user._id });
  if (!company) throw new ErrorResponse('Company profile not found', 404);

  if (job.companyId.toString() !== company._id.toString()) {
    throw new ErrorResponse('Not authorized to view applicants', 403);
  }

  const Application = require('../models/Application');
  const applicants = await Application.find({ jobId: job._id })
    .populate('studentId', 'personalInfo.name personalInfo.branch academics.cgpa skills')
    .sort({ appliedAt: -1 });

  res.status(200).json({
    success: true,
    count: applicants.length,
    data: applicants
  });
});

module.exports = {
  createJob,
  getJobs,
  getMyJobs,
  getJobById,
  updateJob,
  deleteJob,
  getJobApplicants
};