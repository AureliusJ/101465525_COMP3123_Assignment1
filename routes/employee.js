const express = require('express');
const { check, validationResult } = require('express-validator');
const Employee = require('../models/employee'); // Adjust path as needed
const mongoose = require('mongoose');

const router = express.Router();

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Fetch all employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching employees', error: err.message });
  }
});

// Add an employee
router.post(
  '/',
  [
    check('first_name', 'First name is required').not().isEmpty(),
    check('last_name', 'Last name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('position', 'Position is required').not().isEmpty(),
    check('salary', 'Salary must be a number').isNumeric(),
    check('date_of_joining', 'Date of joining must be a valid date').isDate(),
    check('department', 'Department is required').not().isEmpty()
  ],
  handleValidationErrors,
  async (req, res) => {
    const { first_name, last_name, email, position, salary, date_of_joining, department } = req.body;

    const newEmployee = new Employee({
      first_name,
      last_name,
      email,
      position,
      salary,
      date_of_joining,
      department
    });

    try {
      await newEmployee.save();
      res.status(201).json({ message: 'Employee created successfully', employee_id: newEmployee._id });
    } catch (err) {
      res.status(500).json({ message: 'Error creating employee', error: err.message });
    }
  }
);

 // get employees by ID
 app.get(
    '/api/v1/emp/employees/:eid',
    [
      check('eid', 'Invalid Employee ID').isMongoId()
    ],
    handleValidationErrors,
    async (req, res) => {
      const { eid } = req.params;

    
      try {
        const employee = await Employee.findById(eid);
        if (!employee) {
          return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json(employee);
      } catch (err) {
        res.status(500).json({ message: 'Error fetching employee details', error: err.message });
      }
    }
  );

  
//update employee by ID
app.put(
    '/api/v1/emp/employees/:eid',
    [
      check('eid', 'Invalid Employee ID').isMongoId(),
      check('first_name', 'First name is required').optional().not().isEmpty(),
      check('last_name', 'Last name is required').optional().not().isEmpty(),
      check('email', 'Please include a valid email').optional().isEmail(),
      check('position', 'Position is required').optional().not().isEmpty(),
      check('salary', 'Salary must be a number').optional().isNumeric(),
      check('date_of_joining', 'Date of joining must be a valid date').optional().isDate(),
      check('department', 'Department is required').optional().not().isEmpty()
    ],
    handleValidationErrors,
    async (req, res) => {
      const { eid } = req.params;
      const updates = req.body;
  
    try {
      const updatedEmployee = await Employee.findByIdAndUpdate(eid, updates, { new: true });
      if (!updatedEmployee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
      res.status(200).json({ message: 'Employee details updated successfully', employee: updatedEmployee });
    } catch (err) {
      res.status(500).json({ message: 'Error updating employee details', error: err.message });
    }
  });

  
// delete employees by ID
app.delete(
    '/api/v1/emp/employees/:eid',
    [
      check('eid', 'Invalid Employee ID').isMongoId()
    ],
    handleValidationErrors,
    async (req, res) => {
      const { eid } = req.params;
  
      try {
        const deletedEmployee = await Employee.findByIdAndDelete(eid);
        if (!deletedEmployee) {
          return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json({ message: 'Employee deleted successfully' });
      } catch (err) {
        res.status(500).json({ message: 'Error deleting employee', error: err.message });
      }
    }
  );

  
module.exports = router;
