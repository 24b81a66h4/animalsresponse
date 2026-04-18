const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { protect, admin } = require('../middleware/auth.middleware');
const User = require('../models/user.model');

// Assign complaint
router.put('/complaints/:id/assign', protect, admin, adminController.assignComplaint);

// Get NGOs
router.get('/ngos', protect, admin, adminController.getNgos);

// Get all NGO users (for dropdown)
router.get('/ngo-users', protect, admin, async (req, res) => {
    try {
        const ngoUsers = await User.find({ role: 'ngo' }).select('name email _id');
        res.status(200).json(ngoUsers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;