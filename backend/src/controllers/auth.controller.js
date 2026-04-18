const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); // ✅ ADDED
const { sendPasswordResetEmail } = require('../services/email.service'); // ✅ ADDED

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret_key_123', {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please add all required fields' });
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            role: role || 'user'
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// =========================
// 🔐 FORGOT PASSWORD
// =========================

// @desc    Forgot password — send reset email
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });
        }

        const resetToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET + user.password,
            { expiresIn: '1h' }
        );

        const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${user._id}/${resetToken}`;

        await sendPasswordResetEmail(user.email, resetLink);

        res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// =========================
// 🔐 RESET PASSWORD
// =========================

// @desc    Reset password using token
// @route   POST /api/auth/reset-password/:userId/:token
// @access  Public
const resetPassword = async (req, res) => {
    try {
        const { userId, token } = req.params;
        const { password } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: 'Invalid reset link' });
        }

        jwt.verify(token, process.env.JWT_SECRET + user.password);

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        res.status(200).json({ message: 'Password reset successful. You can now log in.' });
    } catch (error) {
        res.status(400).json({ message: 'Reset link is invalid or expired' });
    }
};

module.exports = {
    register,
    login,
    getMe,
    forgotPassword,   // ✅ ADDED
    resetPassword,    // ✅ ADDED
};