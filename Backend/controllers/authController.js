const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      // Use same generic message to prevent email enumeration
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Compare using the secure method (handles pepper internally)
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

module.exports = { loginAdmin };
