const express = require('express');
const router = express.Router();

const ngoController = require('../controllers/ngo.controller');
const { protect, ngo } = require('../middleware/auth.middleware');

router.get('/profile', protect, ngo, ngoController.getNgoProfile);
router.get('/analytics', protect, ngo, ngoController.getNgoAnalytics);
router.get('/available-complaints', protect, ngo, ngoController.getAvailableComplaints);
router.get('/complaints', protect, ngo, ngoController.getAssignedComplaints);
router.put('/complaints/:id/assign', protect, ngo, ngoController.selfAssignComplaint);
router.put('/complaints/:id/status', protect, ngo, ngoController.updateNgoComplaintStatus);

module.exports = router;