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
  updateTravelBookingStatus,
  updateTravelPaymentStatus,
  deleteTravelBooking,
  dispatchTravelBooking,
} = require('../controllers/travelController');
const {
  getAllReviews,
  getAdminReviews,
  createReview,
  updateReview,
  toggleReviewApproval,
  deleteReview,
} = require('../controllers/reviewController');

// ========================
// PUBLIC ROUTES (Customer)
// ========================
router.get('/tours', getAllTours);              // Fetch all tour packages
router.get('/tours/:id', getTourById);         // Fetch a specific tour
router.post('/bookings', createTravelBooking); // Create a new travel booking

// ========================
// REVIEW ROUTES (Public + Email-Verified Edit)
// ========================
router.get('/reviews', getAllReviews);                                         // Fetch all approved reviews
router.get('/reviews/admin', authMiddleware, getAdminReviews); // Fetch ALL reviews (approved & pending)
router.post('/reviews', upload.array('photos', 5), createReview);             // Submit a new review (up to 5 photos)
router.put('/reviews/:id/approve', authMiddleware, toggleReviewApproval); // Toggle approval status
router.put('/reviews/:id', authMiddleware, upload.array('photos', 5), updateReview); // Edit review (Admin only)
router.delete('/reviews/:id', authMiddleware, deleteReview);  // Admin delete review

// ============================
// PROTECTED ROUTES (Admin only)
// ============================
router.post('/tours', authMiddleware, upload.array('images', 10), addTour);  // Add tour with up to 10 images
router.put('/tours/:id', authMiddleware, upload.array('images', 10), updateTour);  // Edit tour (with optional new images)
router.delete('/tours/:id', authMiddleware, deleteTour); // Delete a tour package
router.get('/bookings', authMiddleware, getAllTravelBookings); // View all travel bookings
router.put('/bookings/:id/status', authMiddleware, updateTravelBookingStatus); // Update status
router.put('/bookings/:id/payment', authMiddleware, updateTravelPaymentStatus); // Update payment status
router.put('/bookings/:id/dispatch', authMiddleware, dispatchTravelBooking); // Assign driver & dispatch details
router.delete('/bookings/:id', authMiddleware, deleteTravelBooking); // Delete booking

module.exports = router;

