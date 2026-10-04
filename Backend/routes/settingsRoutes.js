const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getSettings,
  updateSettings,
  patchSection,
} = require('../controllers/settingsController');

// ========================
// PUBLIC ROUTES
// ========================
router.get('/', getSettings); // Public high-speed read for customer frontends

// ========================
// PROTECTED ADMIN ROUTES
// ========================
router.put('/', authMiddleware, updateSettings); // Full admin update
router.patch('/:section', authMiddleware, patchSection); // Granular section update

module.exports = router;
