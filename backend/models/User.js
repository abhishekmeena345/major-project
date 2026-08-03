// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema(
//   {
//     email: {
//       type: String,
//       required: [true, 'Email is required'],
//       unique: true,
//       lowercase: true,
//       trim: true,
//       match: [
//         /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
//         'Please enter a valid email'
//       ]
//     },
//     password: {
//       type: String,
//       required: [true, 'Password is required'],
//       minlength: [6, 'Password must be at least 6 characters']
//     },
//     role: {
//       type: String,
//       required: [true, 'Role is required'],
//       enum: {
//         values: ['student', 'tpo', 'company', 'alumni'],
//         message: 'Role must be student, tpo, company, or alumni'
//       }
//     },
//     isVerified: {
//       type: Boolean,
//       default: false
//     }
//   },
//   {
//     timestamps: true
//   }
// );

// module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  role: {
    type: String,
    enum: ['student', 'company', 'alumni', 'tpo'],  // ← 'tpo' added back
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// 🔐 Password hash before save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await require('bcryptjs').genSalt(10);
  this.password = await require('bcryptjs').hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', userSchema);