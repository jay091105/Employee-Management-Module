const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Sign in controller
exports.signIn = async (req, res) => {
    console.log('Sign in request received:', { email: req.body.email });
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            console.log('Missing email or password');
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        console.log('User found:', user ? 'Yes' : 'No');
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        console.log('Password match:', isMatch);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your_jwt_secret_key_here',
            { expiresIn: '24h' }
        );

        // Return user data and token
        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        });
    } catch (error) {
        console.error('Sign in error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Sign up controller
exports.signUp = async (req, res) => {
    console.log('Sign up request received:', { ...req.body, password: '***' });
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            console.log('Missing required fields');
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        console.log('User exists:', existingUser ? 'Yes' : 'No');
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const user = new User({
            name,
            email,
            password,
            role: 'user'
        });

        await user.save();
        console.log('User saved successfully');

        // Generate token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your_jwt_secret_key_here',
            { expiresIn: '24h' }
        );

        // Return user data and token
        res.status(201).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        });
    } catch (error) {
        console.error('Sign up error:', error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
    console.log('Get current user request received:', { userId: req.params.userId });
    try {
        const userId = req.params.userId;
        if (!userId) {
            console.log('No user ID provided');
            return res.status(400).json({ message: 'User ID is required' });
        }

        const user = await User.findById(userId).select('-password');
        console.log('User found:', user ? 'Yes' : 'No');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}; 