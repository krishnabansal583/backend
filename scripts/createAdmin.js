// scripts/createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Adjust path as needed
require('dotenv').config(); // Make sure to have dotenv installed

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Connection Error:', err));

const createAdminUser = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      mongoose.disconnect();
      return;
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('arbindu@123', salt);
    
    // Create admin user
    const adminUser = new User({
      name: 'Arbindu Kumar',
      email: 'arbindu.kumar@medifinder.in',
      mobile: '9096272663',
      password: hashedPassword,
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      isApproved: true,
      role: 'admin'
    });
    
    await adminUser.save();
    console.log('Admin user created successfully');
    
  } catch (err) {
    console.error('Error creating admin user:', err);
  } finally {
    mongoose.disconnect();
  }
};

createAdminUser();