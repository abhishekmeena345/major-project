const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Student = require('../models/Student');
const Company = require('../models/Company');
const AlumniProfile = require('../models/AlumniProfile');
const generateToken = require('../utils/generateToken');
const { ErrorResponse } = require('../middleware/errorMiddleware');

// ============================================
// @desc    Register new user (Student / Company / Alumni)
// @route   POST /api/auth/register
// @access  Public
// ============================================
const register = asyncHandler(async (req, res) => {
  const { email, password, role, profileData } = req.body;

  // Validate required fields
  if (!email || !password || !role) {
    throw new ErrorResponse('Please provide email, password and role', 400);
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ErrorResponse('User already exists with this email', 400);
  }

  // Validate role
  const validRoles = ['student', 'company', 'alumni'];
  if (!validRoles.includes(role)) {
    throw new ErrorResponse('Role must be student, company, or alumni', 400);
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    email,
    password: hashedPassword,
    role,
    isVerified: false // TPO will verify later
  });

  // Create role-specific profile
  if (role === 'student') {
    if (!profileData) {
      throw new ErrorResponse('Student profile data is required', 400);
    }
    await Student.create({
      userId: user._id,
      ...profileData
    });
  } else if (role === 'company') {
    if (!profileData) {
      throw new ErrorResponse('Company profile data is required', 400);
    }
    await Company.create({
      userId: user._id,
      ...profileData
    });
  } else if (role === 'alumni') {
    if (!profileData) {
      throw new ErrorResponse('Alumni profile data is required', 400);
    }
    await AlumniProfile.create({
      userId: user._id,
      ...profileData
    });
  }

  // Generate token
  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: 'Registration successful. Waiting for TPO verification.',
    data: {
      _id: user._id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      token
    }
  });
});

// ============================================
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
// ============================================
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    throw new ErrorResponse('Please provide email and password', 400);
  }

  // Find user and include password for comparison
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new ErrorResponse('Invalid email or password', 401);
  }

  // Check if user is verified
  if (!user.isVerified) {
    throw new ErrorResponse('Account not verified yet. Please contact TPO.', 403);
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ErrorResponse('Invalid email or password', 401);
  }

  // Generate token
  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      _id: user._id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      token
    }
  });
});

// ============================================
// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
// ============================================
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    throw new ErrorResponse('User not found', 404);
  }

  // Fetch role-specific profile
  let profile = null;
  if (user.role === 'student') {
    profile = await Student.findOne({ userId: user._id });
  } else if (user.role === 'company') {
    profile = await Company.findOne({ userId: user._id });
  } else if (user.role === 'alumni') {
    profile = await AlumniProfile.findOne({ userId: user._id });
  }

  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      profile
    }
  });
});

// ============================================
// @desc    TPO verifies a user account
// @route   POST /api/auth/verify/:userId
// @access  Private (TPO only)
// ============================================
const verifyUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    throw new ErrorResponse('User not found', 404);
  }

  if (user.isVerified) {
    throw new ErrorResponse('User is already verified', 400);
  }

  user.isVerified = true;
  await user.save();

  res.status(200).json({
    success: true,
    message: `User ${user.email} has been verified successfully`,
    data: {
      _id: user._id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified
    }
  });
});

// ============================================
// @desc    Get all pending verifications (TPO only)
// @route   GET /api/auth/pending-verifications
// @access  Private (TPO only)
// ============================================
const getPendingVerifications = asyncHandler(async (req, res) => {
  const pendingUsers = await User.find({ isVerified: false })
    .select('-password')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: pendingUsers.length,
    data: pendingUsers
  });
});

module.exports = {
  register,
  login,
  getMe,
  verifyUser,
  getPendingVerifications
};