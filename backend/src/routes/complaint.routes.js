const express = require('express');
const router = express.Router();

const {
    submitComplaint,
    getAllComplaints,
    getMyComplaints,
    getComplaintById,
    updateComplaintStatus,
    deleteComplaint,
} = require('../controllers/complaint.controller');

const { protect, admin } = require('../middleware/auth.middleware');
const { handleUpload } = require('../middleware/upload.middleware');

router.post('/', protect, handleUpload, submitComplaint);
router.get('/', protect, admin, getAllComplaints);
router.get('/my', protect, getMyComplaints);
router.get('/:id', protect, getComplaintById);
router.put('/:id/status', protect, updateComplaintStatus);
router.delete('/:id', protect, deleteComplaint);

module.exports = router;