const express = require('express');
const router = express.Router();
const { loginAdmin } = require('../controllers/authController');

// POST /api/auth/login → Verifies admin credentials and returns a JWT token
router.post('/login', loginAdmin);

module.exports = router;
