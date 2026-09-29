const mongoose = require('mongoose');
require('dotenv').config();
const Admin = require('./models/Admin');

const dropOld = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Admin.deleteMany({}); // Clears all admins
    console.log('Old admin cleared. Ready to seed new one.');
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
};

dropOld();
