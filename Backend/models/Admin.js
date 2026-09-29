const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  }
}, { timestamps: true });

// ==========================================
// PASSWORD SECURITY: SALT + PEPPER
// ==========================================
// Salt: bcrypt automatically generates a unique random salt for every password.
// Pepper: A secret string (from .env) added to the password BEFORE hashing.
//         Even if the database is leaked, passwords can't be cracked without
//         knowing the pepper stored on the server.

// Hash password before saving (pre-save hook)
adminSchema.pre('save', async function () {
  // Only hash if the password field has been modified
  if (!this.isModified('password')) return;

  // Add pepper to the password
  const pepper = process.env.PASSWORD_PEPPER || '';
  const pepperedPassword = this.password + pepper;

  // Generate salt (12 rounds) and hash
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(pepperedPassword, salt);
});

// Method to compare passwords (used during login)
adminSchema.methods.comparePassword = async function (candidatePassword) {
  const pepper = process.env.PASSWORD_PEPPER || '';
  const pepperedCandidate = candidatePassword + pepper;
  return await bcrypt.compare(pepperedCandidate, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
