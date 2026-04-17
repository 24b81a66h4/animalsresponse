const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { protect, admin } = require('../middleware/auth.middleware');

router.put('/complaints/:id/assign', protect, admin, adminController.assignComplaint);
router.get('/ngos', protect, admin, adminController.getNgos);

module.exports = router;
