const express = require('express');
const router = express.Router();

const {
    createComplaint,
    getComplaints,
    getMyComplaints,
    getComplaintById,
    updateComplaintStatus,
    assignComplaint,
    getPublicComplaints,
    deleteComplaint,
} = require('../controllers/complaint.controller');

const { protect, admin } = require('../middleware/auth.middleware');
const { handleUpload } = require('../middleware/upload.middleware');

router.get('/public', getPublicComplaints);
router.post('/', protect, handleUpload, createComplaint);
router.get('/', protect, getComplaints);
router.get('/my', protect, getMyComplaints);
router.get('/:id', protect, getComplaintById);
router.put('/:id/status', protect, updateComplaintStatus);
router.put('/:id/assign', protect, admin, assignComplaint);
router.delete('/:id', protect, deleteComplaint);

module.exports = router;