const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
  getAllRooms,
  getAllRoomsAdmin,
  getRoomById,
  checkRoomAvailability,
  addRoom,
  updateRoom,
  deleteRoom,
  toggleRoomAvailability,
  createBooking,
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
  addFolioCharge,
  removeFolioCharge,
  settleBookingFolio,
  uploadGuestIdProof,
  exportPoliceRegister,
} = require('../controllers/hotelController');
const { getAllReviews, createReview } = require('../controllers/reviewController');

// ========================
// PUBLIC ROUTES (Customer)
// ========================
router.get('/rooms', getAllRooms);                                // Fetch all available rooms
router.get('/rooms/check-availability', checkRoomAvailability);   // Check availability for dates
router.get('/rooms/:id', getRoomById);                           // Fetch a specific room
router.post('/bookings', createBooking);                         // Create a new reservation
router.get('/reviews', (req, res, next) => {                     // Fetch approved hotel reviews
  req.category = 'hotel';
  return getAllReviews(req, res, next);
});
router.post('/reviews', (req, res, next) => {                    // Submit a new hotel review
  req.body = Object.assign({}, req.body, { category: 'hotel' });
  return createReview(req, res, next);
});

// ============================
// PROTECTED ROUTES (Admin only)
// ============================
router.get('/rooms-admin', authMiddleware, getAllRoomsAdmin);  // Fetch ALL rooms (including unavailable)
router.post('/rooms', authMiddleware, upload.array('images', 10), addRoom);  // Add room with up to 10 images
router.put('/rooms/:id', authMiddleware, upload.array('images', 10), updateRoom);  // Update room (with optional new images)
router.put('/rooms/:id/toggle', authMiddleware, toggleRoomAvailability);  // Toggle room availability
router.delete('/rooms/:id', authMiddleware, deleteRoom); // Delete a room
router.get('/bookings', authMiddleware, getAllBookings);  // View all reservations
router.get('/bookings/police-register', authMiddleware, exportPoliceRegister); // Export police verification register (CSV)
router.put('/bookings/:id/status', authMiddleware, updateBookingStatus); // Update booking status
router.post('/bookings/:id/folio', authMiddleware, addFolioCharge); // Add itemized on-property charge
router.delete('/bookings/:id/folio/:chargeId', authMiddleware, removeFolioCharge); // Remove folio charge
router.put('/bookings/:id/settle', authMiddleware, settleBookingFolio); // Settle payment & checkout
router.post('/bookings/:id/id-proof', authMiddleware, upload.single('idProof'), uploadGuestIdProof); // Upload digital guest ID proof
router.delete('/bookings/:id', authMiddleware, deleteBooking); // Delete booking

module.exports = router;
