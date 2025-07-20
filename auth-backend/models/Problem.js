const mongoose = require('mongoose');

const testCaseSchema = mongoose.Schema({
  input: {
    type: String,
    required: true
  },
  expectedOutput: {
    type: String,
    required: true
  },
  isHidden: {
    type: Boolean,
    default: false
  }
});

const problemSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard']
  },
  tags: [{
    type: String,
    trim: true
  }],
  timeLimit: {
    type: Number,
    required: true,
    default: 2000 // milliseconds
  },
  memoryLimit: {
    type: Number,
    required: true,
    default: 128 // MB
  },
  testCases: [testCaseSchema],
  constraints: {
    type: String,
    default: ''
  },
  inputFormat: {
    type: String,
    default: ''
  },
  outputFormat: {
    type: String,
    default: ''
  },
  sampleInput: {
    type: String,
    default: ''
  },
  sampleOutput: {
    type: String,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  acceptedSubmissions: {
    type: Number,
    default: 0
  },
  totalSubmissions: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Add index for better query performance
problemSchema.index({ difficulty: 1, tags: 1 });

module.exports = mongoose.model('Problem', problemSchema);
