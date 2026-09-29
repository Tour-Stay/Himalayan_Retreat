const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
  getAllTours,
  getTourById,
  addTour,
  updateTour,
  deleteTour,
  createTravelBooking,
  getAllTravelBookings,
} = require('../controllers/travelController');

// ========================
// PUBLIC ROUTES (Customer)
// ========================
router.get('/tours', getAllTours);              // Fetch all tour packages
router.get('/tours/:id', getTourById);         // Fetch a specific tour
router.post('/bookings', createTravelBooking); // Create a new travel booking

// ============================
// PROTECTED ROUTES (Admin only)
// ============================
router.post('/tours', authMiddleware, upload.array('images', 10), addTour);  // Add tour with up to 10 images
router.put('/tours/:id', authMiddleware, updateTour);    // Edit a tour package
router.delete('/tours/:id', authMiddleware, deleteTour); // Delete a tour package
router.get('/bookings', authMiddleware, getAllTravelBookings); // View all travel bookings

module.exports = router;
