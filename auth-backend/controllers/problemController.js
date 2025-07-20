const Problem = require('../models/Problem');
const User = require('../models/User');

// @desc    Get all problems
// @route   GET /api/problems
// @access  Public
const getProblems = async (req, res) => {
  try {
    const { page = 1, limit = 10, difficulty, tags } = req.query;
    
    const query = {};
    if (difficulty) {
      query.difficulty = difficulty;
    }
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      query.tags = { $in: tagArray };
    }

    const problems = await Problem.find(query)
      .select('-testCases') // Don't expose test cases to frontend
      .populate('createdBy', 'username')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const totalProblems = await Problem.countDocuments(query);

    res.json({
      problems,
      totalPages: Math.ceil(totalProblems / limit),
      currentPage: page,
      totalProblems
    });
  } catch (error) {
    console.error('Error fetching problems:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single problem by ID
// @route   GET /api/problems/:id
// @access  Public
const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id)
      .select('-testCases') // Don't expose test cases
      .populate('createdBy', 'username');

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    res.json(problem);
  } catch (error) {
    console.error('Error fetching problem:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create new problem
// @route   POST /api/problems
// @access  Private (Admin)
const createProblem = async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
      tags,
      timeLimit,
      memoryLimit,
      testCases,
      constraints,
      inputFormat,
      outputFormat,
      sampleInput,
      sampleOutput
    } = req.body;

    // Check if user is admin (you'll need to add role field to User model)
    const user = await User.findById(req.user._id);
    if (!user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to create problems' });
    }

    const problem = new Problem({
      title,
      description,
      difficulty,
      tags: tags || [],
      timeLimit: timeLimit || 2000,
      memoryLimit: memoryLimit || 128,
      testCases: testCases || [],
      constraints,
      inputFormat,
      outputFormat,
      sampleInput,
      sampleOutput,
      createdBy: req.user._id
    });

    const createdProblem = await problem.save();
    
    // Populate creator info before sending response
    await createdProblem.populate('createdBy', 'username');

    res.status(201).json(createdProblem);
  } catch (error) {
    console.error('Error creating problem:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update problem
// @route   PUT /api/problems/:id
// @access  Private (Admin)
const updateProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    // Check if user is admin
    const user = await User.findById(req.user._id);
    if (!user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update problems' });
    }

    const updatedProblem = await Problem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'username');

    res.json(updatedProblem);
  } catch (error) {
    console.error('Error updating problem:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete problem
// @route   DELETE /api/problems/:id
// @access  Private (Admin)
const deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    // Check if user is admin
    const user = await User.findById(req.user._id);
    if (!user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete problems' });
    }

    await Problem.findByIdAndDelete(req.params.id);

    res.json({ message: 'Problem deleted successfully' });
  } catch (error) {
    console.error('Error deleting problem:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get problem statistics
// @route   GET /api/problems/stats
// @access  Public
const getProblemStats = async (req, res) => {
  try {
    const totalProblems = await Problem.countDocuments();
    const difficultyStats = await Problem.aggregate([
      {
        $group: {
          _id: '$difficulty',
          count: { $sum: 1 }
        }
      }
    ]);

    const tagStats = await Problem.aggregate([
      { $unwind: '$tags' },
      {
        $group: {
          _id: '$tags',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      totalProblems,
      difficultyStats,
      popularTags: tagStats
    });
  } catch (error) {
    console.error('Error fetching problem stats:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getProblems,
  getProblemById,
  createProblem,
  updateProblem,
  deleteProblem,
  getProblemStats
};
