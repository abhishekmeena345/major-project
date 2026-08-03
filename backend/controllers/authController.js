// const asyncHandler = require('express-async-handler');
// const bcrypt = require('bcryptjs');
// const User = require('../models/User');
// const Student = require('../models/Student');
// const Company = require('../models/Company');
// const AlumniProfile = require('../models/AlumniProfile');
// const generateToken = require('../utils/generateToken');
// const { ErrorResponse } = require('../middleware/errorMiddleware');

// // ============================================
// // @desc    Register new user
// // @route   POST /api/auth/register
// // @access  Public
// // ============================================
// const register = asyncHandler(async (req, res) => {
//   const { name, email, password, role, branch, year, rollNumber, phone, cgpa, tenthPercentage, twelfthPercentage } = req.body;

//   // ✅ Validation
//   if (!email || !password || !role) {
//     throw new ErrorResponse('Please provide email, password and role', 400);
//   }

//   if (role === 'student') {
//     if (!tenthPercentage || tenthPercentage === '') {
//       throw new ErrorResponse('10th percentage is required', 400);
//     }
//     if (!twelfthPercentage || twelfthPercentage === '') {
//       throw new ErrorResponse('12th percentage is required', 400);
//     }
//   }

//   // Check if user already exists
//   const userExists = await User.findOne({ email });
//   if (userExists) {
//     throw new ErrorResponse('User already exists with this email', 400);
//   }

//   // Validate role
//   const validRoles = ['student', 'company', 'tpo'];
//   if (!validRoles.includes(role)) {
//     throw new ErrorResponse('Role must be student, company, or tpo', 400);
//   }

//   // Hash password
//   const salt = await bcrypt.genSalt(10);
//   const hashedPassword = await bcrypt.hash(password, salt);

//   // Create user
//   const user = await User.create({
//     email,
//     password: hashedPassword,
//     role,
//     isVerified: role === 'tpo' ? true : false
//   });

//   // Create role-specific profile
//   if (role === 'student') {
//     const studentData = {
//       userId: user._id,
//       personalInfo: {
//         name: name || '',
//         email: email || '',
//         phone: phone || '',
//         branch: branch || '',
//         year: year ? parseInt(year) : '',
//         rollNumber: rollNumber || ''
//       },
//       academics: {
//         cgpa: cgpa ? parseFloat(cgpa) : 0,
//         backlogs: 0,
//         tenthPercent: tenthPercentage ? parseFloat(tenthPercentage) : 0,      // ← FIX: "Percent" not "Percentage"
//         twelfthPercent: twelfthPercentage ? parseFloat(twelfthPercentage) : 0  // ← FIX: "Percent" not "Percentage"
//       },
//       skills: []
//     };

//     // If resume uploaded during registration
//     if (req.file) {
//       studentData.resumeUrl = `/uploads/resumes/${req.file.filename}`;
//     }

//     await Student.create(studentData);
//   } else if (role === 'company') {
//     await Company.create({
//       userId: user._id,
//       name: name || 'My Company',
//       description: '',
//       website: '',
//       logo: ''
//     });
//   } else if (role === 'tpo') {
//     // TPO doesn't need a separate profile model
//   }

//   // Generate token
//   const token = generateToken(user._id);

//   res.status(201).json({
//     success: true,
//     message: role === 'tpo' ? 'Registration successful' : 'Registration successful. Waiting for TPO verification.',
//     data: {
//       _id: user._id,
//       email: user.email,
//       role: user.role,
//       isVerified: user.isVerified,
//       token
//     }
//   });
// });

// // ============================================
// // @desc    Login user
// // @route   POST /api/auth/login
// // @access  Public
// // ============================================
// const login = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     throw new ErrorResponse('Please provide email and password', 400);
//   }

//   const user = await User.findOne({ email }).select('+password');

//   if (!user) {
//     throw new ErrorResponse('Invalid email or password', 401);
//   }

//   if (!user.isVerified) {
//     throw new ErrorResponse('Account not verified yet. Please contact TPO.', 403);
//   }

//   const isMatch = await bcrypt.compare(password, user.password);

//   if (!isMatch) {
//     throw new ErrorResponse('Invalid email or password', 401);
//   }

//   const token = generateToken(user._id);

//   res.status(200).json({
//     success: true,
//     message: 'Login successful',
//     data: {
//       _id: user._id,
//       email: user.email,
//       role: user.role,
//       isVerified: user.isVerified,
//       token
//     }
//   });
// });

// // ============================================
// // @desc    Get current logged in user
// // @route   GET /api/auth/me
// // @access  Private
// // ============================================
// const getMe = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user.id);

//   if (!user) {
//     throw new ErrorResponse('User not found', 404);
//   }

//   let profile = null;
//   if (user.role === 'student') {
//     profile = await Student.findOne({ userId: user._id }).select('-__v');
//   } else if (user.role === 'company') {
//     profile = await Company.findOne({ userId: user._id }).select('-__v');
//   } else if (user.role === 'alumni') {
//     profile = await AlumniProfile.findOne({ userId: user._id }).select('-__v');
//   }

//   res.status(200).json({
//     success: true,
//     data: {
//       _id: user._id,
//       email: user.email,
//       role: user.role,
//       isVerified: user.isVerified,
//       profile
//     }
//   });
// });

// // ============================================
// // @desc    TPO verifies a user account
// // @route   POST /api/auth/verify/:userId
// // @access  Private (TPO only)
// // ============================================
// const verifyUser = asyncHandler(async (req, res) => {
//   const { userId } = req.params;

//   const user = await User.findById(userId);

//   if (!user) {
//     throw new ErrorResponse('User not found', 404);
//   }

//   if (user.isVerified) {
//     throw new ErrorResponse('User is already verified', 400);
//   }

//   user.isVerified = true;
//   await user.save();

//   res.status(200).json({
//     success: true,
//     message: `User ${user.email} has been verified successfully`,
//     data: {
//       _id: user._id,
//       email: user.email,
//       role: user.role,
//       isVerified: user.isVerified
//     }
//   });
// });

// // ============================================
// // @desc    Get all pending verifications
// // @route   GET /api/auth/pending-verifications
// // @access  Private (TPO only)
// // ============================================
// const getPendingVerifications = asyncHandler(async (req, res) => {
//   const pendingUsers = await User.find({ isVerified: false })
//     .select('-password')
//     .sort({ createdAt: -1 });

//   res.status(200).json({
//     success: true,
//     count: pendingUsers.length,
//     data: pendingUsers
//   });
// });

// module.exports = {
//   register,
//   login,
//   getMe,
//   verifyUser,
//   getPendingVerifications
// };

const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Student = require('../models/Student');
const Company = require('../models/Company');
const AlumniProfile = require('../models/AlumniProfile');
const generateToken = require('../utils/generateToken');
const { ErrorResponse } = require('../middleware/errorMiddleware');

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  if (!email || !password || !role || !name || !phone) {
    throw new ErrorResponse('Please provide name, email, password, phone and role', 400);
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ErrorResponse('User already exists with this email', 400);
  }

  const validRoles = ['student', 'company', 'alumni', 'tpo'];
  if (!validRoles.includes(role)) {
    throw new ErrorResponse('Invalid role', 400);
  }

  // ✅ TPO auto-verified, baaki sab TPO se verify honge
  const isVerified = role === 'tpo' ? true : false;

  const user = await User.create({
    email,
    password: password,
    role,
    isVerified
  });

  if (role === 'student') {
    await Student.create({
      userId: user._id,
      personalInfo: {
        name: name || '',
        email: email || '',
        phone: phone || '',
        branch: '',
        year: null,
        rollNumber: ''
      },
      academics: {
        cgpa: null,
        backlogs: 0,
        tenthPercent: null,
        twelfthPercent: null
      },
      skills: [],
      profileCompleted: false
    });
  } else if (role === 'company') {
    await Company.create({
      userId: user._id,
      name: name || 'My Company',
      description: '',
      website: '',
      logo: ''
    });
  } else if (role === 'alumni') {
    await AlumniProfile.create({
      userId: user._id,
      name: name || '',
      email: email || '',
      phone: phone || '',
      company: '',
      role: '',
      batch: null,
      branch: '',
      willingToRefer: false,
      mentorshipAvailable: false
    });
  }

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: role === 'tpo' ? 'TPO Registration successful' : 'Registration successful. Waiting for TPO verification.',
    data: {
      _id: user._id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      token
    }
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ErrorResponse('Please provide email and password', 400);
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new ErrorResponse('Invalid email or password', 401);
  }

  if (!user.isVerified) {
    throw new ErrorResponse('Account not verified yet. Please contact TPO.', 403);
  }

  const bcrypt = require('bcryptjs');
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ErrorResponse('Invalid email or password', 401);
  }

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

const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    throw new ErrorResponse('User not found', 404);
  }

  let profile = null;
  if (user.role === 'student') {
    profile = await Student.findOne({ userId: user._id }).select('-__v');
  } else if (user.role === 'company') {
    profile = await Company.findOne({ userId: user._id }).select('-__v');
  } else if (user.role === 'alumni') {
    profile = await AlumniProfile.findOne({ userId: user._id }).select('-__v');
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

const verifyUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) throw new ErrorResponse('User not found', 404);
  if (user.isVerified) throw new ErrorResponse('User is already verified', 400);

  user.isVerified = true;
  await user.save();

  res.status(200).json({
    success: true,
    message: `${user.role} verified successfully`,
    data: {
      _id: user._id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified
    }
  });
});

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