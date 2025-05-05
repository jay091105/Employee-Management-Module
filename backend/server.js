const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
console.log('Attempting to connect to MongoDB...');
mongoose.connect('mongodb+srv://jay:jay212530@cluster0.qjastib.mongodb.net/?retryWrites=true&w=majority', {
   
})
.then(() => {
    console.log('Connected to MongoDB');
    // Initialize models after successful connection
    require('./models/User');
    require('./models/Employee');
})
.catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// Import routes and middleware
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const { auth, adminAuth } = require('./middleware/auth');

// Log all incoming requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Make POST /api/employees public, protect other employee routes
app.post('/api/employees', employeeRoutes);
app.use('/api/employees', auth, employeeRoutes);

console.log('Routes registered:');
console.log('- POST /api/auth/signin');
console.log('- POST /api/auth/signup');
console.log('- GET /api/auth/user/:userId');
console.log('- GET /api/employees');
console.log('- POST /api/employees');
console.log('- GET /api/employees/:id');
console.log('- PUT /api/employees/:id');
console.log('- DELETE /api/employees/:id');

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    console.error(`404: ${req.method} ${req.url}`);
    res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('Available routes:');
    console.log('- POST /api/auth/signin');
    console.log('- POST /api/auth/signup');
    console.log('- GET /api/auth/user/:userId');
    console.log('- GET /api/employees');
    console.log('- POST /api/employees');
    console.log('- GET /api/employees/:id');
    console.log('- PUT /api/employees/:id');
    console.log('- DELETE /api/employees/:id');
    console.log('- GET /api/test');
});
