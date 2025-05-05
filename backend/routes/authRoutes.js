const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Log route registration
console.log('Setting up auth routes...');

// Auth routes
router.post('/signin', authController.signIn);
router.post('/signup', authController.signUp);
router.get('/user/:userId', authController.getCurrentUser);

// Log available routes
console.log('Auth routes configured:');
console.log('- POST /signin');
console.log('- POST /signup');
console.log('- GET /user/:userId');

module.exports = router; 