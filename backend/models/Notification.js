const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['broadcast', 'job_alert', 'interview', 'shortlisted', 'reminder', 'general'],
    default: 'broadcast'
  },
  senderRole: {
    type: String,
    enum: ['tpo', 'company', 'system'],
    default: 'tpo'
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Target filters (optional - for targeted broadcasts)
  targetBranches: [{
    type: String
  }],
  targetYears: [{
    type: String
  }],
  targetRoles: [{
    type: String,
    enum: ['student', 'company', 'alumni']
  }],
  // If notification is for everyone
  isGlobal: {
    type: Boolean,
    default: true
  },
  // Read status per user (embedded array)
  readBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for faster queries
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ targetRoles: 1 });
notificationSchema.index({ isGlobal: 1 });

module.exports = mongoose.model('Notification', notificationSchema);