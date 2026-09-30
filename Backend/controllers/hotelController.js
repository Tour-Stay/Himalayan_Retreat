const Room = require('../models/Room');
const Booking = require('../models/Booking');
const { uploadToCloudinary } = require('../config/cloudinary');
const { sendHotelBookingEmail } = require('../config/emailService');

// ========================
// ROOM CONTROLLERS (CRUD)
// ========================

// @desc    Get all available rooms
// @route   GET /api/hotel/rooms
// @access  Public
const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ isAvailable: true });
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// @desc    Get a single room by ID
// @route   GET /api/hotel/rooms/:id
// @access  Public
const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found.' });
    }
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// @desc    Add a new room
// @route   POST /api/hotel/rooms
// @access  Protected (Admin only)
const addRoom = async (req, res) => {
  try {
    const { name, description, pricePerNight } = req.body;
    let capacity = req.body.capacity;
    let amenities = req.body.amenities;

    // Parse if they come as strings from FormData
    if (typeof capacity === 'string') {
      try { capacity = JSON.parse(capacity); } catch (e) {}
    }
    if (typeof amenities === 'string') {
      try { amenities = JSON.parse(amenities); } catch (e) {}
    }

    // Upload images to Cloudinary (with automatic base64 fallback if Cloudinary credentials fail)
    let imageURLs = [];
    if (req.files && req.files.length > 0) {
      try {
        const uploadPromises = req.files.map((file) =>
          uploadToCloudinary(file.buffer, 'hotel-rooms')
        );
        const results = await Promise.all(uploadPromises);
        imageURLs = results.map((result) => result.secure_url);
      } catch (cloudErr) {
        console.warn('⚠️ Cloudinary upload warning (using base64 fallback):', cloudErr.message || cloudErr);
        // Fallback: convert file buffer to base64 data URI so image displays seamlessly
        imageURLs = req.files.map((file) => {
          const mime = file.mimetype || 'image/jpeg';
          return `data:${mime};base64,${file.buffer.toString('base64')}`;
        });
      }
    }

    const room = await Room.create({
      name,
      description,
      pricePerNight,
      capacity,
      amenities,
      imageURLs,
    });

    res.status(201).json({ message: 'Room added successfully.', room });
  } catch (error) {
    console.error('Add Room Error:', error);
    res.status(500).json({ message: 'Server error.', error: error.message || error });
  }
};

// @desc    Update a room
// @route   PUT /api/hotel/rooms/:id
// @access  Protected (Admin only)
const updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found.' });
    }

    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true,
    });

    res.status(200).json({ message: 'Room updated successfully.', room: updatedRoom });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// @desc    Delete a room
// @route   DELETE /api/hotel/rooms/:id
// @access  Protected (Admin only)
const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found.' });
    }

    await Room.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Room deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// ============================
// BOOKING CONTROLLERS
// ============================

// @desc    Create a new hotel booking (with date conflict check)
// @route   POST /api/hotel/bookings
// @access  Public
const createBooking = async (req, res) => {
  try {
    const { room, guestDetails, checkInDate, checkOutDate } = req.body;

    // Validate dates
    if (new Date(checkInDate) >= new Date(checkOutDate)) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date.' });
    }

    // Check for date conflicts — ensure the room is not already booked for those dates
    const conflictingBooking = await Booking.findOne({
      room: room,
      status: { $ne: 'cancelled' }, // Ignore cancelled bookings
      $or: [
        {
          checkInDate: { $lt: new Date(checkOutDate) },
          checkOutDate: { $gt: new Date(checkInDate) },
        },
      ],
    });

    if (conflictingBooking) {
      return res.status(409).json({ message: 'This room is already booked for the selected dates.' });
    }

    // Calculate total amount
    const roomData = await Room.findById(room);
    if (!roomData) {
      return res.status(404).json({ message: 'Room not found.' });
    }

    const nights = Math.ceil(
      (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)
    );
    const totalAmount = nights * roomData.pricePerNight;

    // Create the booking
    const booking = await Booking.create({
      room,
      guestDetails,
      checkInDate,
      checkOutDate,
      totalAmount,
      status: 'pending',
    });

    // Send confirmation email (non-blocking — don't fail booking if email fails)
    try {
      await sendHotelBookingEmail(booking, roomData);
    } catch (emailError) {
      console.error('Email sending failed:', emailError.message);
    }

    res.status(201).json({ message: 'Booking created successfully.', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// @desc    Get all hotel bookings
// @route   GET /api/hotel/bookings
// @access  Protected (Admin only)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('room', 'name pricePerNight');
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

module.exports = {
  getAllRooms,
  getRoomById,
  addRoom,
  updateRoom,
  deleteRoom,
  createBooking,
  getAllBookings,
};
