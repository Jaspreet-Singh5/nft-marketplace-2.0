const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
    try {
        const { username, password, walletAddress } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Create new user
        const user = new User({ username, password, walletAddress });
        await user.save();

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '24h',
        });

        res.status(201).json({ user: { id: user._id, username: user.username }, token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // Generate token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '24h',
        });

        res.json({ user: { id: user._id, username: user.username }, token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get current user profile
router.get('/profile', auth, async (req, res) => {
    try {
        res.json({
            id: req.user._id,
            username: req.user.username,
            walletAddress: req.user.walletAddress,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update wallet address
router.patch('/update-wallet', auth, async (req, res) => {
    try {
        const { walletAddress } = req.body;

        req.user.walletAddress = walletAddress;
        await req.user.save();

        res.json({ message: 'Wallet address updated', walletAddress });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Logout - just for session based auth (not needed for JWT)
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;
