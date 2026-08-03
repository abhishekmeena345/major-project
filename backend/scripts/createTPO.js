const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config({ path: './.env' });  // ✅ Fixed path

const createTPO = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if TPO already exists
    const existingTPO = await User.findOne({ email: 'tpo@college.edu' });
    if (existingTPO) {
      console.log('⚠️ TPO already exists');
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('tpopass123', salt);

    // Create TPO user
    const tpo = await User.create({
      email: 'tpo@college.edu',
      password: hashedPassword,
      role: 'tpo',
      isVerified: true,
    });

    console.log('✅ TPO created successfully:', tpo);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createTPO();