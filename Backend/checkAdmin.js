const mongoose = require('mongoose');
require('dotenv').config();
const Admin = require('./models/Admin');
const bcrypt = require('bcrypt');

const check = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const admin = await Admin.findOne({ email: 'admin@devbhoomi.com' });
    if (!admin) {
      console.log('No admin found!');
    } else {
      console.log('Admin found:', admin.email);
      console.log('Hashed Password in DB:', admin.password);
      
      const pepper = process.env.PASSWORD_PEPPER || '';
      console.log('Pepper from env:', pepper);
      
      const isMatch = await admin.comparePassword('Admin@2026Secure!');
      console.log('Does Admin@2026Secure! match?', isMatch);
    }
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
};

check();
