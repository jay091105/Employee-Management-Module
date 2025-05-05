const express = require('express');
const router = express.Router();
const {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  searchEmployees
} = require('../controllers/employeeController');
const { auth, adminAuth } = require('../middleware/auth');

// Protected routes
router.get('/', auth, getAllEmployees);
router.get('/search', auth, searchEmployees);
router.get('/:id', auth, getEmployeeById);
router.post('/', auth, adminAuth, createEmployee);
router.put('/:id', auth, adminAuth, updateEmployee);
router.delete('/:id', auth, adminAuth, deleteEmployee);

module.exports = router; 