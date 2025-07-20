const Submission = require('../models/Submission');
const Problem = require('../models/Problem');
const CompilerService = require('../services/compilerService');

const compilerService = new CompilerService();

// @desc    Submit solution
// @route   POST /api/submissions
// @access  Private
const submitSolution = async (req, res) => {
  try {
    const { problemId, code, language } = req.body;

    // Validate input
    if (!problemId || !code || !language) {
      return res.status(400).json({ message: 'Problem ID, code, and language are required' });
    }

    if (!['cpp', 'java', 'python'].includes(language)) {
      return res.status(400).json({ message: 'Invalid language' });
    }

    // Get problem details
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    // Create submission record
    const submission = new Submission({
      userId: req.user._id,
      problemId,
      code,
      language,
      status: 'Pending',
      totalTestCases: problem.testCases.length
    });

    await submission.save();

    // Process submission asynchronously
    processSubmission(submission._id, problem, code, language);

    res.status(201).json({
      submissionId: submission._id,
      status: 'Pending',
      message: 'Submission received and being processed'
    });

  } catch (error) {
    console.error('Error submitting solution:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Process submission in background
const processSubmission = async (submissionId, problem, code, language) => {
  try {
    const submission = await Submission.findById(submissionId);
    if (!submission) return;

    // Run test cases
    const testResult = await compilerService.runTestCases(
      code,
      language,
      problem.testCases,
      problem.timeLimit,
      problem.memoryLimit
    );

    let status = 'Wrong Answer';
    let verdict = `Passed ${testResult.passedCount}/${testResult.totalCount} test cases`;

    // Determine final status
    if (testResult.results.length > 0) {
      const lastResult = testResult.results[testResult.results.length - 1];
      
      if (lastResult.status === 'Runtime Error') {
        status = 'Runtime Error';
        verdict = lastResult.error || 'Runtime error occurred';
      } else if (lastResult.status === 'Compilation Error') {
        status = 'Compilation Error';
        verdict = lastResult.error || 'Compilation failed';
      } else if (lastResult.executionTime > problem.timeLimit) {
        status = 'Time Limit Exceeded';
        verdict = `Time limit exceeded (${lastResult.executionTime}ms > ${problem.timeLimit}ms)`;
      } else if (testResult.passedCount === testResult.totalCount) {
        status = 'Accepted';
        verdict = `All ${testResult.totalCount} test cases passed`;
      }
    }

    // Calculate average execution time
    const avgExecutionTime = testResult.results.reduce((sum, result) => 
      sum + result.executionTime, 0) / testResult.results.length;

    // Update submission
    await Submission.findByIdAndUpdate(submissionId, {
      status,
      verdict,
      testCasesPassed: testResult.passedCount,
      executionTime: Math.round(avgExecutionTime),
      errorMessage: testResult.results.find(r => r.error)?.error || '',
      output: testResult.results[0]?.actualOutput || ''
    });

    // Update problem statistics
    await Problem.findByIdAndUpdate(problem._id, {
      $inc: {
        totalSubmissions: 1,
        ...(status === 'Accepted' && { acceptedSubmissions: 1 })
      }
    });

  } catch (error) {
    console.error('Error processing submission:', error);
    
    // Update submission with error status
    await Submission.findByIdAndUpdate(submissionId, {
      status: 'Runtime Error',
      verdict: 'Internal server error during execution',
      errorMessage: error.message
    });
  }
};

// @desc    Get submission by ID
// @route   GET /api/submissions/:id
// @access  Private
const getSubmission = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('userId', 'username')
      .populate('problemId', 'title');

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Check if user owns the submission or is admin
    if (submission.userId._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view this submission' });
    }

    res.json(submission);
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get user's submissions
// @route   GET /api/submissions/user/:userId
// @access  Private
const getUserSubmissions = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20, problemId, status } = req.query;

    // Check if user is viewing their own submissions or is admin
    if (userId !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view these submissions' });
    }

    const query = { userId };
    if (problemId) query.problemId = problemId;
    if (status) query.status = status;

    const submissions = await Submission.find(query)
      .populate('problemId', 'title difficulty')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const totalSubmissions = await Submission.countDocuments(query);

    res.json({
      submissions,
      totalPages: Math.ceil(totalSubmissions / limit),
      currentPage: page,
      totalSubmissions
    });
  } catch (error) {
    console.error('Error fetching user submissions:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all submissions for a problem
// @route   GET /api/submissions/problem/:problemId
// @access  Private (Admin)
const getProblemSubmissions = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view all submissions' });
    }

    const { problemId } = req.params;
    const { page = 1, limit = 20, status } = req.query;

    const query = { problemId };
    if (status) query.status = status;

    const submissions = await Submission.find(query)
      .populate('userId', 'username')
      .populate('problemId', 'title')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const totalSubmissions = await Submission.countDocuments(query);

    res.json({
      submissions,
      totalPages: Math.ceil(totalSubmissions / limit),
      currentPage: page,
      totalSubmissions
    });
  } catch (error) {
    console.error('Error fetching problem submissions:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Test code without submission
// @route   POST /api/submissions/test
// @access  Private
const testCode = async (req, res) => {
  try {
    const { code, language, input } = req.body;

    if (!code || !language) {
      return res.status(400).json({ message: 'Code and language are required' });
    }

    if (!['cpp', 'java', 'python'].includes(language)) {
      return res.status(400).json({ message: 'Invalid language' });
    }

    const result = await compilerService.executeCode(code, language, input || '');

    res.json({
      status: result.status,
      output: result.output,
      error: result.error,
      executionTime: result.executionTime
    });

  } catch (error) {
    console.error('Error testing code:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get submission statistics
// @route   GET /api/submissions/stats
// @access  Public
const getSubmissionStats = async (req, res) => {
  try {
    const totalSubmissions = await Submission.countDocuments();
    
    const statusStats = await Submission.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const languageStats = await Submission.aggregate([
      {
        $group: {
          _id: '$language',
          count: { $sum: 1 }
        }
      }
    ]);

    const recentSubmissions = await Submission.find()
      .populate('userId', 'username')
      .populate('problemId', 'title')
      .select('status language executionTime createdAt')
      .limit(10)
      .sort({ createdAt: -1 });

    res.json({
      totalSubmissions,
      statusStats,
      languageStats,
      recentSubmissions
    });
  } catch (error) {
    console.error('Error fetching submission stats:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  submitSolution,
  getSubmission,
  getUserSubmissions,
  getProblemSubmissions,
  testCode,
  getSubmissionStats
};
