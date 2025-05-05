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
const { auth } = require('../middleware/auth');

// Public route
router.post('/', createEmployee);

// Protected routes
router.use(auth);
router.get('/', getAllEmployees);
router.get('/search', searchEmployees);
router.get('/:id', getEmployeeById);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

module.exports = router; 