const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
  getAllRooms,
  getRoomById,
  addRoom,
  updateRoom,
  deleteRoom,
  createBooking,
  getAllBookings,
} = require('../controllers/hotelController');

// ========================
// PUBLIC ROUTES (Customer)
// ========================
router.get('/rooms', getAllRooms);          // Fetch all available rooms
router.get('/rooms/:id', getRoomById);     // Fetch a specific room
router.post('/bookings', createBooking);   // Create a new reservation

// ============================
// PROTECTED ROUTES (Admin only)
// ============================
router.post('/rooms', authMiddleware, upload.array('images', 10), addRoom);  // Add room with up to 10 images
router.put('/rooms/:id', authMiddleware, updateRoom);    // Update room details/price
router.delete('/rooms/:id', authMiddleware, deleteRoom); // Delete a room
router.get('/bookings', authMiddleware, getAllBookings);  // View all reservations

module.exports = router;
