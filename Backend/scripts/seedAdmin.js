// =====================================================
// ONE-TIME ADMIN SEED SCRIPT
// =====================================================
// Run this to create the admin account:
//   npm run seed:admin
// =====================================================

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Admin = require('../models/Admin');

const seedAdmin = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB...');

    const adminEmail = process.env.ADMIN_EMAIL || 'himalayan@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'himalayan123';

    // Remove all previous admin accounts from the database
    const deleteResult = await Admin.deleteMany({});
    console.log(`🗑️ Removed ${deleteResult.deletedCount} old admin account(s) from database.`);

    // Create the new admin (password auto-hashed with salt & pepper by pre-save hook)
    const admin = await Admin.create({
      email: adminEmail,
      password: adminPassword,
    });

    // Verification check
    const isValid = await admin.comparePassword(adminPassword);

    console.log('✅ Admin created successfully!');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: ${adminPassword}`);
    console.log(`   Verification Test: ${isValid ? 'PASSED (Ready to log in)' : 'FAILED'}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();
