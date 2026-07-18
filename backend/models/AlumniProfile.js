const mongoose = require('mongoose');

const alumniProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    company: {
      type: String,
      required: [true, 'Current company is required'],
      trim: true
    },
    role: {
      type: String,
      required: [true, 'Current role is required'],
      trim: true
    },
    batch: {
      type: Number,
      required: [true, 'Graduation batch year is required'],
      min: 2000,
      max: 2030
    },
    branch: {
      type: String,
      required: [true, 'Branch is required'],
      enum: ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'OTHER']
    },
    willingToRefer: {
      type: Boolean,
      default: false
    },
    mentorshipAvailable: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('AlumniProfile', alumniProfileSchema);