const mongoose = require('mongoose');

const tpoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    personalInfo: {
      name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
      },
      designation: {
        type: String,
        default: 'Training & Placement Officer',
        trim: true
      },
      department: {
        type: String,
        default: 'Training & Placement',
        trim: true
      },
      contactNumber: {
        type: String,
        trim: true,
        match: [/^\d{10}$/, 'Please enter a valid 10-digit contact number']
      }
    },
    collegeDetails: {
      collegeName: {
        type: String,
        required: [true, 'College name is required'],
        trim: true
      },
      collegeCode: {
        type: String,
        required: [true, 'College code is required'],
        trim: true
      },
      address: {
        type: String,
        required: [true, 'College address is required'],
        trim: true
      },
      website: {
        type: String,
        trim: true,
        match: [
          /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
          'Please enter a valid website URL'
        ]
      }
    },
    permissions: {
      canVerifyUsers: {
        type: Boolean,
        default: true
      },
      canPostJobs: {
        type: Boolean,
        default: true
      },
      canSendNotifications: {
        type: Boolean,
        default: true
      },
      canViewAnalytics: {
        type: Boolean,
        default: true
      },
      canManageCompanies: {
        type: Boolean,
        default: true
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('TPO', tpoSchema);