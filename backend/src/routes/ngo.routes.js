const express = require('express');
const router = express.Router();

const ngoController = require('../controllers/ngo.controller');
const { protect, ngo } = require('../middleware/auth.middleware');

// @route   GET /api/ngo/profile
router.get('/profile', protect, ngo, ngoController.getNgoProfile);

// @route   GET /api/ngo/complaints
router.get('/complaints', protect, ngo, ngoController.getAssignedComplaints);

// @route   PUT /api/ngo/complaints/:id/status
router.put('/complaints/:id/status', protect, ngo, ngoController.updateNgoComplaintStatus);

module.exports = router;