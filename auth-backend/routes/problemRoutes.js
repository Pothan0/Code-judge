const express = require('express');
const router = express.Router();
const {
  getProblems,
  getProblemById,
  createProblem,
  updateProblem,
  deleteProblem,
  getProblemStats
} = require('../controllers/problemController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getProblems);
router.get('/stats', getProblemStats);
router.get('/:id', getProblemById);

// Protected routes (require authentication)
router.post('/', protect, createProblem);
router.put('/:id', protect, updateProblem);
router.delete('/:id', protect, deleteProblem);

module.exports = router;
