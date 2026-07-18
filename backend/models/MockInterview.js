const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true
    },
    studentAnswer: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    suggestions: {
      type: String,
      required: true
    },
    keywordsMatched: [
      {
        type: String
      }
    ],
    grammarScore: {
      type: Number,
      min: 0,
      max: 100
    }
  }
);

const mockInterviewSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    questions: [
      {
        type: String,
        required: true
      }
    ],
    answers: [
      {
        type: String,
        default: ''
      }
    ],
    aiFeedback: [feedbackSchema],
    overallScore: {
      type: Number,
      default: null,
      min: 0,
      max: 100
    },
    status: {
      type: String,
      enum: ['in_progress', 'completed'],
      default: 'in_progress'
    },
    takenAt: {
      type: Date,
      default: Date.now
    },
    completedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('MockInterview', mockInterviewSchema);