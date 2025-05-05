const Employee = require('../models/Employee');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/profile-pictures';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
}).single('profilePicture');

// Get all employees
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees', error: error.message });
  }
};

// Get employee by ID
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employee', error: error.message });
  }
};

// Create new employee
const createEmployee = async (req, res) => {
  try {
    upload(req, res, async function(err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: 'File upload error', error: err.message });
      } else if (err) {
        return res.status(400).json({ message: 'Error uploading file', error: err.message });
      }

      const employeeData = { ...req.body };
      if (req.file) {
        employeeData.profilePicture = req.file.path;
      }
      if (employeeData.address) {
        employeeData.address = JSON.parse(employeeData.address);
      }

      const employee = new Employee(employeeData);
      await employee.save();
      res.status(201).json(employee);
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating employee', error: error.message });
  }
};

// Update employee
const updateEmployee = async (req, res) => {
  try {
    upload(req, res, async function(err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: 'File upload error', error: err.message });
      } else if (err) {
        return res.status(400).json({ message: 'Error uploading file', error: err.message });
      }

      const employeeData = { ...req.body };
      if (req.file) {
        // Delete old profile picture if exists
        const oldEmployee = await Employee.findById(req.params.id);
        if (oldEmployee.profilePicture && fs.existsSync(oldEmployee.profilePicture)) {
          fs.unlinkSync(oldEmployee.profilePicture);
        }
        employeeData.profilePicture = req.file.path;
      }
      if (employeeData.address) {
        employeeData.address = JSON.parse(employeeData.address);
      }

      const employee = await Employee.findByIdAndUpdate(
        req.params.id,
        employeeData,
        { new: true, runValidators: true }
      );
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
      res.json(employee);
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating employee', error: error.message });
  }
};

// Delete employee
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Delete profile picture if exists
    if (employee.profilePicture && fs.existsSync(employee.profilePicture)) {
      fs.unlinkSync(employee.profilePicture);
    }

    await employee.remove();
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting employee', error: error.message });
  }
};

// Search employees
const searchEmployees = async (req, res) => {
  try {
    const { query } = req.query;
    const employees = await Employee.find({
      $or: [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { department: { $regex: query, $options: 'i' } },
        { position: { $regex: query, $options: 'i' } }
      ]
    });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Error searching employees', error: error.message });
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  searchEmployees
}; 