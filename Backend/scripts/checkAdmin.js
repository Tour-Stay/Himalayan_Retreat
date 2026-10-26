const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');

const check = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const admins = await Admin.find({});
    console.log(`Total admins in DB: ${admins.length}`);
    for (const a of admins) {
      console.log(`- Admin: ${a.email}`);
      const isMatch = await a.comparePassword('himalayan123');
      console.log(`  Password 'himalayan123' valid: ${isMatch}`);
    }
  } catch (err) {
    console.error('Error checking admin:', err);
  } finally {
    await mongoose.disconnect();
  }
};

check();
