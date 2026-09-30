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

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@himalayan.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@2026Secure!';

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log(`⚠️  Admin (${adminEmail}) already exists. No action taken.`);
      process.exit(0);
    }

    // Create the admin (password auto-hashed with pepper by pre-save hook)
    const admin = await Admin.create({
      email: adminEmail,
      password: adminPassword,
    });

    console.log('✅ Admin created successfully!');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: ${adminPassword}`);
    console.log('🔒 Remember to change the password or remove this file in production.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();
