const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: ['applied', 'shortlisted', 'interview', 'placed', 'rejected'],
      default: 'applied'
    },
    matchPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    interviewSlot: {
      date: {
        type: Date,
        default: null
      },
      time: {
        type: String,
        default: null
      },
      meetLink: {
        type: String,
        default: null
      }
    }
  },
  {
    timestamps: true
  }
);

// Compound index: ek student ek job par sirf ek baar apply kar sakta hai
applicationSchema.index({ jobId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);