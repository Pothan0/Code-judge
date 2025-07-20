const express = require('express');
const router = express.Router();
const {
  submitSolution,
  getSubmission,
  getUserSubmissions,
  getProblemSubmissions,
  testCode,
  getSubmissionStats
} = require('../controllers/submissionController');
const { protect } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// Submission routes
router.post('/', submitSolution);
router.post('/test', testCode);
router.get('/stats', getSubmissionStats);
router.get('/:id', getSubmission);
router.get('/user/:userId', getUserSubmissions);
router.get('/problem/:problemId', getProblemSubmissions);

module.exports = router;
