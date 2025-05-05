const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Log route registration
console.log('Setting up auth routes...');

// Auth routes
router.post('/signin', (req, res, next) => {
    console.log('Signin route hit with data:', { email: req.body.email });
    authController.signIn(req, res, next);
});

router.post('/signup', (req, res, next) => {
    console.log('Signup route hit with data:', { 
        name: req.body.name,
        email: req.body.email 
    });
    authController.signUp(req, res, next);
});

router.get('/user/:userId', (req, res, next) => {
    console.log('Get user route hit with userId:', req.params.userId);
    authController.getCurrentUser(req, res, next);
});

// Log available routes
console.log('Auth routes configured:');
console.log('- POST /signin');
console.log('- POST /signup');
console.log('- GET /user/:userId');

module.exports = router; 