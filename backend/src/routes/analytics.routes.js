const express = require('express');
const router = express.Router();

const { getAnalytics } = require('../controllers/analytics.controller');
const { protect, admin } = require('../middleware/auth.middleware');

// @route   GET /api/analytics
// @access  Private (Admin)
router.get('/', protect, admin, getAnalytics);

module.exports = router;