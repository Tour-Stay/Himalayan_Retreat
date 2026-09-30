const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');

const check = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const admin = await Admin.findOne({ email: 'admin@himalayan.com' }) || await Admin.findOne({});
    if (!admin) {
      console.log('No admin found in database!');
    } else {
      console.log('Admin found:', admin.email);
      console.log('Hashed Password in DB:', admin.password);
      
      const pepper = process.env.PASSWORD_PEPPER || '';
      console.log('Pepper from env:', pepper ? 'Configured' : 'Missing');
      
      const isMatch = await admin.comparePassword('Admin@2026Secure!');
      console.log('Does Admin@2026Secure! match default seed?', isMatch);
    }
  } catch (err) {
    console.error('Error checking admin:', err);
  } finally {
    await mongoose.disconnect();
  }
};

check();
