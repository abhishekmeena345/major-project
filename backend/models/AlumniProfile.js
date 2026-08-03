const mongoose = require('mongoose');

const alumniProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    name: {
      type: String,
      default: ''
    },
    email: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      default: ''
    },
    company: {
      type: String,
      default: ''  // ← Optional now
    },
    role: {
      type: String,
      default: ''  // ← Optional now
    },
    batch: {
      type: Number,
      default: null  // ← Optional now
    },
    branch: {
      type: String,
      enum: ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'OTHER', ''],
      default: ''  // ← Optional now
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