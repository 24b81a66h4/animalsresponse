const express = require('express');
const router = express.Router();
const { submitFeedback, getFeedbackForComplaint, getNgoAverageRating } = require('../controllers/feedback.controller');
const { protect, ngo } = require('../middleware/auth.middleware');

router.post('/:complaintId', protect, submitFeedback);
router.get('/:complaintId', protect, getFeedbackForComplaint);
router.get('/ngo/my-rating', protect, ngo, getNgoAverageRating);

module.exports = router;