const mongoose = require('mongoose');
const { ErrorResponse } = require('./errorMiddleware');

// ============================================
// Auth Validators
// ============================================
const validateRegister = (req, res, next) => {
  const { email, password, role, tenthPercentage, twelfthPercentage } = req.body;
  
  if (!email || !password || !role) {
    return next(new ErrorResponse('Please provide email, password and role', 400));
  }
  
  if (role === 'student') {
    if (!tenthPercentage || tenthPercentage === '') {
      return next(new ErrorResponse('10th percentage is required', 400));
    }
    if (!twelfthPercentage || twelfthPercentage === '') {
      return next(new ErrorResponse('12th percentage is required', 400));
    }
  }
  
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorResponse('Please provide email and password', 400));
  }
  next();
};

// ============================================
// Common Validators
// ============================================
const validateObjectId = (paramName) => {
  return (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params[paramName])) {
      return next(new ErrorResponse(`Invalid ${paramName}`, 400));
    }
    next();
  };
};

// ============================================
// Job Validator — Actual Validation Added
// ============================================
const validateJob = (req, res, next) => {
  const { title, description, package, location, type, deadline } = req.body;
  
  if (!title || !description || !package || !location || !type || !deadline) {
    return next(new ErrorResponse('Please provide title, description, package, location, type and deadline', 400));
  }
  
  // Validate package is a number
  if (isNaN(parseFloat(package))) {
    return next(new ErrorResponse('Package must be a valid number', 400));
  }
  
  // Validate deadline is a valid date
  if (isNaN(Date.parse(deadline))) {
    return next(new ErrorResponse('Deadline must be a valid date', 400));
  }
  
  next();
};

// ============================================
// Stubs for other routes (to prevent crashes)
// ============================================
const validateApplication = (req, res, next) => next();
const validateInterview = (req, res, next) => next();
const validateCompany = (req, res, next) => next();
const validateStudent = (req, res, next) => next();
const validateTPO = (req, res, next) => next();
const validateBroadcast = (req, res, next) => next();
const validateNotification = (req, res, next) => next();
const validateResume = (req, res, next) => next();
const validateAI = (req, res, next) => next();

module.exports = {
  validateRegister,
  validateLogin,
  validateObjectId,
  validateJob,
  validateApplication,
  validateInterview,
  validateCompany,
  validateStudent,
  validateTPO,
  validateBroadcast,
  validateNotification,
  validateResume,
  validateAI
};