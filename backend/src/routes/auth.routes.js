const express = require('express');
const router = express.Router();

const {
    register,
    login,
    getMe,
    forgotPassword,
    resetPassword
} = require('../controllers/auth.controller');

const { protect } = require('../middleware/auth.middleware');

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// 🔐 Password reset routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:userId/:token', resetPassword);

module.exports = router;