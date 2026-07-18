const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: ['job_alert', 'status_update', 'deadline', 'broadcast', 'interview_schedule'],
      default: 'job_alert'
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true
    },
    isRead: {
      type: Boolean,
      default: false
    },
    metadata: {
      // Extra info jaise jobId, applicationId, etc.
      jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        default: null
      },
      applicationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application',
        default: null
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Notification', notificationSchema);