// const mongoose = require('mongoose');

// const referralSchema = new mongoose.Schema(
//   {
//     alumniId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true
//     },
//     studentId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true
//     },
//     status: {
//       type: String,
//       required: true,
//       enum: ['pending', 'accepted', 'declined'],
//       default: 'pending'
//     },
//     message: {
//       type: String,
//       required: [true, 'Please provide a message for the referral request'],
//       trim: true,
//       maxlength: [500, 'Message cannot exceed 500 characters']
//     },
//     responseMessage: {
//       type: String,
//       default: '',
//       trim: true
//     },
//     respondedAt: {
//       type: Date,
//       default: null
//     }
//   },
//   {
//     timestamps: true
//   }
// );

// // Compound index: ek student ek alumni se sirf ek baar request kar sakta hai
// referralSchema.index({ alumniId: 1, studentId: 1 }, { unique: true });

// module.exports = mongoose.model('Referral', referralSchema);

const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  alumniId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  alumniResponse: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Referral', referralSchema);