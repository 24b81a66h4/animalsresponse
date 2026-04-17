const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaint.controller');
const { protect, admin, ngo } = require('../middleware/auth.middleware');

router.route('/')
    .post(protect, complaintController.createComplaint)
    .get(protect, complaintController.getComplaints);

router.route('/:id')
    .get(protect, complaintController.getComplaintById);

// Admin or NGO can update status
router.route('/:id/status')
    .put(protect, ngo, complaintController.updateComplaintStatus);

module.exports = router;
