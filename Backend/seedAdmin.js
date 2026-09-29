// =====================================================
// ONE-TIME ADMIN SEED SCRIPT
// =====================================================
// Run this ONCE to create the admin account:
//   node seedAdmin.js
//
// After running, DELETE this file or move it out of the
// project so no one can accidentally run it again.
// =====================================================

const mongoose = require('mongoose');
require('dotenv').config();
const Admin = require('./models/Admin');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB...');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'abc_lalit@gmail.com' });
    if (existingAdmin) {
      console.log('⚠️  Admin already exists. No action taken.');
      process.exit(0);
    }

    // Create the admin (password will be auto-hashed by the pre-save hook)
    const admin = await Admin.create({
      email: 'abc_lalit@gmail.com',
      password: 'Deepak&Lalit', // Change this to the boss's actual password
    });

    console.log('✅ Admin created successfully!');
    console.log(`   Email: ${admin.email}`);
    console.log('   Password: (the one you set above)');
    console.log('\n🔒 DELETE this file now for security!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();
