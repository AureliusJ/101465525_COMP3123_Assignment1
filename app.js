const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');      
const Employee = require('./models/employee'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const uri = "mongodb+srv://jason:jason@comp3123-assignment1.uo4dy.mongodb.net/comp3123_assignment1?retryWrites=true&w=majority";
mongoose.connect(uri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  };
  

//user signup post
app.post(
    '/api/v1/user/signup',
    [
      check('username', 'Username is required').not().isEmpty(),
      check('email', 'Please include a valid email').isEmail(),
      check('password', 'Password must be at least 6 characters long').isLength({ min: 6 })
    ],
    handleValidationErrors,
    async (req, res) => {
      const { username, email, password } = req.body;
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
  
    try {
      await newUser.save();
      res.status(201).json({ message: 'User created successfully', user_id: newUser._id });
    } catch (err) {
      res.status(500).json({ message: 'Error creating user', error: err.message });
    }
  });

  //User login post
  app.post(
    '/api/v1/user/login',
    [
      check('email', 'Please include a valid email').isEmail(),
      check('password', 'Password is required').exists()
    ],
    handleValidationErrors,
    async (req, res) => {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ user_id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
  
      res.status(200).json({ message: 'Login successful', jwt_token: token });
    }
  );

// fetch employees
  app.get('/api/v1/emp/employees', async (req, res) => {
    try {
      const employees = await Employee.find();
      res.status(200).json(employees);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching employees', error: err.message });
    }
  });


//add employees
app.post(
    '/api/v1/emp/employees',
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
  });
  

  // get employees by ID
  app.get('/api/v1/emp/employees/:eid', async (req, res) => {
    const { eid } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(eid)) {
    return res.status(400).json({ message: 'Invalid Employee ID' });
  }

    try {
      const employee = await Employee.findById(eid);
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
      res.status(200).json(employee);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching employee details', error: err.message });
    }
  });

  
  //update employee by ID
  app.put('/api/v1/emp/employees/:eid', async (req, res) => {
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
app.delete('/api/v1/emp/employees/:eid', async (req, res) => {
    const { eid } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(eid)) {
      return res.status(400).json({ message: 'Invalid Employee ID' });
    }
  
    try {
      const deletedEmployee = await Employee.findByIdAndDelete(eid);
      if (!deletedEmployee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
      res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting employee', error: err.message });
    }
  });