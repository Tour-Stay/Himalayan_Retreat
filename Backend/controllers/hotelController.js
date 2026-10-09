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

// @desc    Check room availability for given dates (prevents double-booking)
// @route   GET /api/hotel/rooms/check-availability
// @access  Public
const checkRoomAvailability = async (req, res) => {
  try {
    const { checkIn, checkOut, roomId } = req.query;

    if (!checkIn || !checkOut) {
      return res.status(400).json({ message: 'Both checkIn and checkOut dates are required.' });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return res.status(400).json({ message: 'Invalid check-in or check-out date format.' });
    }

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ message: 'Check-out date must be strictly after check-in date.' });
    }

    // Find any non-cancelled bookings that overlap with requested range
    const bCheckInStart = new Date(`${checkIn}T23:59:59.999Z`);
    const bCheckOutEnd = new Date(`${checkOut}T00:00:00.000Z`);

    const filter = {
      status: { $ne: 'cancelled' },
      checkInDate: { $lt: bCheckOutEnd },
      checkOutDate: { $gt: bCheckInStart },
    };

    if (roomId) {
      filter.room = roomId;
    }

    const conflictingBookings = await Booking.find(filter).select('room checkInDate checkOutDate status');
    const occupiedRoomIds = conflictingBookings.map((b) => b.room.toString());

    // Fetch all currently active rooms
    const allRooms = await Room.find({ isAvailable: true }).sort({ pricePerNight: 1 });
    const roomsWithAvailability = allRooms.map((room) => {
      const isOccupied = occupiedRoomIds.includes(room._id.toString());
      return {
        ...room.toObject(),
        isAvailableForDates: !isOccupied,
      };
    });

    res.status(200).json({
      checkIn,
      checkOut,
      totalRoomsCount: allRooms.length,
      occupiedCount: occupiedRoomIds.length,
      availableCount: allRooms.length - occupiedRoomIds.length,
      occupiedRoomIds,
      rooms: roomsWithAvailability,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error checking availability.', error: error.message });
  }
};

// @desc    Get ALL rooms (including unavailable — for admin dashboard)
// @route   GET /api/hotel/rooms-admin
// @access  Protected (Admin only)
const getAllRoomsAdmin = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ createdAt: -1 });
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
      try { capacity = JSON.parse(capacity); } catch (e) { }
    }
    if (typeof amenities === 'string') {
      try { amenities = JSON.parse(amenities); } catch (e) { }
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
        console.error('Cloudinary upload failed:', cloudErr.message || cloudErr);
        return res.status(500).json({ message: 'Image upload failed. Please check Cloudinary credentials.', error: cloudErr.message });
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

// @desc    Update a room (with optional new image uploads)
// @route   PUT /api/hotel/rooms/:id
// @access  Protected (Admin only)
const updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found.' });
    }

    const updateData = { ...req.body };

    // Parse FormData string fields
    if (typeof updateData.capacity === 'string') {
      try { updateData.capacity = JSON.parse(updateData.capacity); } catch (e) { }
    }
    if (typeof updateData.amenities === 'string') {
      try { updateData.amenities = JSON.parse(updateData.amenities); } catch (e) { }
    }

    // Handle new image uploads if provided
    if (req.files && req.files.length > 0) {
      let newImageURLs = [];
      try {
        const uploadPromises = req.files.map((file) =>
          uploadToCloudinary(file.buffer, 'hotel-rooms')
        );
        const results = await Promise.all(uploadPromises);
        newImageURLs = results.map((result) => result.secure_url);
      } catch (cloudErr) {
        console.error('Cloudinary upload failed:', cloudErr.message || cloudErr);
        return res.status(500).json({ message: 'Image upload failed. Please check Cloudinary credentials.', error: cloudErr.message });
      }
      // Replace existing images with new uploads
      updateData.imageURLs = newImageURLs;
    }

    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ message: 'Room updated successfully.', room: updatedRoom });
  } catch (error) {
    console.error('Update Room Error:', error);
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

// @desc    Toggle room availability (enable/disable without deleting)
// @route   PUT /api/hotel/rooms/:id/toggle
// @access  Protected (Admin only)
const toggleRoomAvailability = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found.' });
    }

    room.isAvailable = !room.isAvailable;
    await room.save();

    res.status(200).json({
      message: `Room ${room.isAvailable ? 'enabled' : 'disabled'} successfully.`,
      room,
    });
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
    // Using start and end of day to flawlessly handle same-day check-in/check-out overlap
    const bCheckInStart = new Date(`${checkInDate}T23:59:59.999Z`);
    const bCheckOutEnd = new Date(`${checkOutDate}T00:00:00.000Z`);

    const conflictingBooking = await Booking.findOne({
      room: room,
      status: { $ne: 'cancelled' }, // Ignore cancelled bookings
      checkInDate: { $lt: bCheckOutEnd },
      checkOutDate: { $gt: bCheckInStart },
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
    const calculatedTotal = nights * roomData.pricePerNight;
    const totalAmount = Number(req.body.totalAmount) || calculatedTotal;
    const advancePaid = Number(req.body.advancePaid) || 0;
    const balanceDue = Math.max(0, totalAmount - advancePaid);
    const status = req.body.status || 'pending';
    const paymentMode = req.body.paymentMode || (advancePaid > 0 ? 'Cash' : 'Pending');
    const source = req.body.source || 'Website';
    const specialNotes = req.body.specialNotes || '';

    // Create the booking
    const booking = await Booking.create({
      room,
      guestDetails,
      checkInDate,
      checkOutDate,
      totalAmount,
      advancePaid,
      balanceDue,
      paymentMode,
      source,
      specialNotes,
      status,
    });

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
    const bookings = await Booking.find()
      .populate('room', 'name pricePerNight view')
      .sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/hotel/bookings/:id/status
// @access  Protected (Admin only)
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }
    res.status(200).json({ message: 'Booking status updated.', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// @desc    Delete a booking
// @route   DELETE /api/hotel/bookings/:id
// @access  Protected (Admin only)
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }
    res.status(200).json({ message: 'Booking deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// @desc    Add on-property folio charge (meals, bonfire, heaters, extras)
// @route   POST /api/hotel/bookings/:id/folio
// @access  Protected (Admin only)
const addFolioCharge = async (req, res) => {
  try {
    const { item, amount } = req.body;
    const chargeAmount = Number(amount);

    if (!item || isNaN(chargeAmount) || chargeAmount <= 0) {
      return res.status(400).json({ message: 'Valid item description and positive amount are required.' });
    }

    const booking = await Booking.findById(req.params.id).populate('room', 'name pricePerNight');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    booking.folioExtras.push({
      item: item.trim(),
      amount: chargeAmount,
      addedAt: new Date(),
    });

    booking.totalAmount = (Number(booking.totalAmount) || 0) + chargeAmount;
    booking.balanceDue = Math.max(0, booking.totalAmount - (Number(booking.advancePaid) || 0));

    await booking.save();
    res.status(200).json({ message: 'Folio charge added successfully.', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error adding folio charge.', error: error.message });
  }
};

// @desc    Remove folio charge
// @route   DELETE /api/hotel/bookings/:id/folio/:chargeId
// @access  Protected (Admin only)
const removeFolioCharge = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('room', 'name pricePerNight');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    const chargeIndex = booking.folioExtras.findIndex(
      (extra) => extra._id.toString() === req.params.chargeId
    );

    if (chargeIndex === -1) {
      return res.status(404).json({ message: 'Folio charge not found.' });
    }

    const removedAmount = booking.folioExtras[chargeIndex].amount;
    booking.folioExtras.splice(chargeIndex, 1);

    booking.totalAmount = Math.max(0, (Number(booking.totalAmount) || 0) - removedAmount);
    booking.balanceDue = Math.max(0, booking.totalAmount - (Number(booking.advancePaid) || 0));

    await booking.save();
    res.status(200).json({ message: 'Folio charge removed successfully.', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error removing folio charge.', error: error.message });
  }
};

// @desc    Settle folio payment & optionally mark checked out
// @route   PUT /api/hotel/bookings/:id/settle
// @access  Protected (Admin only)
const settleBookingFolio = async (req, res) => {
  try {
    const { amountPaid, paymentMode, markCheckedOut } = req.body;
    const additionalPayment = Number(amountPaid) || 0;

    const booking = await Booking.findById(req.params.id).populate('room', 'name pricePerNight');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    booking.advancePaid = (Number(booking.advancePaid) || 0) + additionalPayment;
    booking.balanceDue = Math.max(0, (Number(booking.totalAmount) || 0) - booking.advancePaid);

    if (paymentMode) {
      booking.paymentMode = paymentMode;
    }

    if (markCheckedOut) {
      booking.status = 'checked_out';
    }

    await booking.save();
    res.status(200).json({ message: 'Folio settled successfully.', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error settling folio.', error: error.message });
  }
};

// @desc    Upload Guest ID Proof (Aadhaar / Passport / Voter ID)
// @route   POST /api/hotel/bookings/:id/id-proof
// @access  Protected (Admin only)
const uploadGuestIdProof = async (req, res) => {
  try {
    const { idProofNumber, idProofType } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    let idProofUrl = booking.idProofUrl || '';

    if (req.file) {
      try {
        const uploadResult = await uploadToCloudinary(req.file.buffer, 'guest-id-proofs');
        idProofUrl = uploadResult.secure_url;
      } catch (cloudErr) {
        console.error('Cloudinary upload failed:', cloudErr.message || cloudErr);
        return res.status(500).json({ message: 'ID Proof upload failed. Please check Cloudinary credentials.', error: cloudErr.message });
      }
    }

    if (idProofUrl) booking.idProofUrl = idProofUrl;
    if (idProofNumber !== undefined) booking.idProofNumber = idProofNumber.trim();
    if (idProofType !== undefined) booking.idProofType = idProofType.trim();

    await booking.save();
    res.status(200).json({ message: 'Guest ID Proof updated successfully.', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error uploading ID proof.', error: error.message });
  }
};

// @desc    Export daily police verification register (CSV)
// @route   GET /api/hotel/bookings/police-register
// @access  Protected (Admin only)
const exportPoliceRegister = async (req, res) => {
  try {
    const targetDateStr = req.query.date || new Date().toISOString().split('T')[0];

    // Find all bookings overlapping with targetDate or all non-cancelled bookings if 'all' requested
    let filter = { status: { $ne: 'cancelled' } };

    if (req.query.date && req.query.date !== 'all') {
      const targetDate = new Date(targetDateStr);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);

      filter = {
        status: { $ne: 'cancelled' },
        checkInDate: { $lt: nextDay },
        checkOutDate: { $gte: targetDate },
      };
    }

    const bookings = await Booking.find(filter)
      .populate('room', 'name')
      .sort({ checkInDate: 1 });

    // Build CSV content
    const headers = [
      'Sl No',
      'Booking ID',
      'Guest Full Name',
      'Mobile Phone',
      'Email Address',
      'Allocated Suite',
      'Check-in Date',
      'Check-out Date',
      'ID Proof Type',
      'ID Proof Number',
      'ID Document Attached',
      'Stay Status',
      'Police Verification Status',
    ];

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = bookings.map((b, idx) => {
      const inDate = b.checkInDate ? new Date(b.checkInDate).toISOString().split('T')[0] : 'N/A';
      const outDate = b.checkOutDate ? new Date(b.checkOutDate).toISOString().split('T')[0] : 'N/A';
      const hasId = Boolean(b.idProofUrl || b.idProofNumber);

      return [
        idx + 1,
        b._id.toString(),
        b.guestDetails?.name || 'N/A',
        b.guestDetails?.phone || 'N/A',
        b.guestDetails?.email || 'N/A',
        b.room?.name || 'Chalet Suite',
        inDate,
        outDate,
        b.idProofType || 'Aadhaar Card',
        b.idProofNumber || 'Pending Verification',
        b.idProofUrl ? 'YES (Digital Copy on File)' : 'NO (Pending)',
        b.status?.toUpperCase() || 'CONFIRMED',
        hasId ? 'VERIFIED' : 'PENDING AT CHECK-IN',
      ].map(escapeCsv).join(',');
    });

    const csvContent = [headers.map(escapeCsv).join(','), ...rows].join('\r\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="Uttarakhand_Police_Guest_Register_${targetDateStr}.csv"`
    );
    return res.status(200).send(csvContent);
  } catch (error) {
    res.status(500).json({ message: 'Server error generating police register.', error: error.message });
  }
};

module.exports = {
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
};


