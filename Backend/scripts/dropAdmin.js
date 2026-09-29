const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Admin = require('../models/Admin');

const dropOld = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const result = await Admin.deleteMany({});
    console.log(`Cleared ${result.deletedCount} admin account(s). Ready to seed new one.`);
  } catch (err) {
    console.error('Error clearing admins:', err);
  } finally {
    await mongoose.disconnect();
  }
};

dropOld();
