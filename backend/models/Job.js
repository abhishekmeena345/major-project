const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      trim: true
    },
    package: {
      type: Number,
      required: [true, 'Package amount is required'],
      min: 0
    },
    location: {
      type: String,
      required: [true, 'Job location is required'],
      trim: true
    },
    type: {
      type: String,
      required: [true, 'Job type is required'],
      enum: ['full-time', 'internship'],
      default: 'full-time'
    },
    eligibility: {
      minCgpa: {
        type: Number,
        required: [true, 'Minimum CGPA is required'],
        min: 0,
        max: 10
      },
      maxBacklogs: {
        type: Number,
        default: 0,
        min: 0
      },
      requiredSkills: [
        {
          type: String,
          trim: true
        }
      ],
      branches: [
        {
          type: String,
          enum: ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'OTHER']
        }
      ]
    },
    deadline: {
      type: Date,
      required: [true, 'Application deadline is required']
    },
    status: {
      type: String,
      enum: ['active', 'closed'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Job', jobSchema);