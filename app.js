const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');  // Import user routes
const employeeRoutes = require('./routes/employee');  // Import employee routes

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

// Use the imported routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/emp/employees', employeeRoutes);
