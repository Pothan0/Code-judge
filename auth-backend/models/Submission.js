const mongoose = require('mongoose');

const submissionSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true,
    enum: ['cpp', 'java', 'python']
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Memory Limit Exceeded', 'Runtime Error', 'Compilation Error'],
    default: 'Pending'
  },
  verdict: {
    type: String,
    default: ''
  },
  executionTime: {
    type: Number, // in milliseconds
    default: 0
  },
  memoryUsed: {
    type: Number, // in MB
    default: 0
  },
  testCasesPassed: {
    type: Number,
    default: 0
  },
  totalTestCases: {
    type: Number,
    default: 0
  },
  errorMessage: {
    type: String,
    default: ''
  },
  output: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for better query performance
submissionSchema.index({ userId: 1, problemId: 1, createdAt: -1 });
submissionSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Submission', submissionSchema);
