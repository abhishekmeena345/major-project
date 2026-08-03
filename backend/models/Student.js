// const mongoose = require('mongoose');

// const studentSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//       unique: true
//     },
//     personalInfo: {
//       name: {
//         type: String,
//         required: [true, 'Name is required'],
//         trim: true
//       },
//       branch: {
//         type: String,
//         required: [true, 'Branch is required'],
//         enum: ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'OTHER']
//       },
//       year: {
//         type: Number,
//         required: [true, 'Year is required'],
//         min: 1,
//         max: 4
//       },
//       rollNumber: {
//         type: String,
//         required: [true, 'Roll number is required'],
//         unique: true,
//         trim: true
//       }
//     },
//     academics: {
//       cgpa: {
//         type: Number,
//         required: [true, 'CGPA is required'],
//         min: 0,
//         max: 10
//       },
//       tenthPercent: {
//         type: Number,
//         required: [true, '10th percentage is required'],
//         min: 0,
//         max: 100
//       },
//       twelfthPercent: {
//         type: Number,
//         required: [true, '12th percentage is required'],
//         min: 0,
//         max: 100
//       },
//       backlogs: {
//         type: Number,
//         default: 0,
//         min: 0
//       }
//     },
//     skills: [
//       {
//         type: String,
//         trim: true
//       }
//     ],
//     resumeUrl: {
//       type: String,
//       default: ''
//     },
//     resumeText: {
//       type: String,
//       default: null
//     },
//     placementProbability: {
//       type: Number,
//       default: null,
//       min: 0,
//       max: 100
//     },
//     preferences: {
//       domains: [
//         {
//           type: String,
//           trim: true
//         }
//       ],
//       expectedPackage: {
//         type: Number,
//         default: null
//       }
//     }
//   },
//   {
//     timestamps: true
//   }
// );

// module.exports = mongoose.model('Student', studentSchema);
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
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
      email: {
        type: String,
        trim: true
      },
      phone: {
        type: String,
        trim: true
      },
      branch: {
        type: String,
        enum: ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'OTHER'],
        default: ''
      },
      year: {
        type: Number,
        min: 1,
        max: 4,
        default: null
      },
      rollNumber: {
        type: String,
        unique: true,
        sparse: true,  // ← Allows multiple null/empty values
        trim: true
      }
    },
    academics: {
      cgpa: {
        type: Number,
        min: 0,
        max: 10,
        default: null
      },
      tenthPercent: {
        type: Number,
        min: 0,
        max: 100,
        default: null
      },
      twelfthPercent: {
        type: Number,
        min: 0,
        max: 100,
        default: null
      },
      backlogs: {
        type: Number,
        default: 0,
        min: 0
      }
    },
    skills: [
      {
        type: String,
        trim: true
      }
    ],
    resumeUrl: {
      type: String,
      default: ''
    },
    resumeFileName: {
      type: String,
      default: ''
    },
    resumeText: {
      type: String,
      default: null
    },
    placementProbability: {
      type: Number,
      default: null,
      min: 0,
      max: 100
    },
    preferences: {
      domains: [
        {
          type: String,
          trim: true
        }
      ],
      expectedPackage: {
        type: Number,
        default: null
      }
    },
    profileCompleted: {
      type: Boolean,
      default: false  // ← Track if profile is complete
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Student', studentSchema);