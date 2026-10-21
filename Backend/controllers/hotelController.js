const Room = require('../models/Room');
const Booking = require('../models/Booking');
const SiteSettings = require('../models/SiteSettings');
const { calculateStayTariff } = require('../config/pricingEngine');
const jwt = require('jsonwebtoken');
const { uploadToCloudinary } = require('../config/cloudinary');
const { sendHotelBookingEmail } = require('../config/emailService');

// ========================
// ROOM CONTROLLERS (CRUD)
// ========================

// @desc    Get all rooms (includes available & unavailable with due date metadata for customers)
// @route   GET /api/hotel/rooms
// @access  Public
const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ pricePerNight: 1 });
    const now = new Date();

    const processedRooms = rooms.map((room) => {
      const roomObj = room.toObject();
      // If unavailableUntil due date has passed, automatically consider available
      const hasPassedDueDate = room.unavailableUntil && new Date(room.unavailableUntil) <= now;
      const isAvailable = hasPassedDueDate ? true : Boolean(room.isAvailable);

      return {
        ...roomObj,
        isAvailable,
        unavailableUntil: hasPassedDueDate ? null : room.unavailableUntil,
        totalRooms: room.totalRooms ?? 1,
        location: room.location || 'Kasar Devi, Almora',
      };
    });

    res.status(200).json(processedRooms);
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

    const conflictingBookings = await Booking.find(filter).select('room roomsBooked checkInDate checkOutDate status');

    // Fetch all rooms (including their administrative availability status)
    const allRooms = await Room.find().sort({ pricePerNight: 1 });
    const now = new Date();

    const occupiedRoomIds = [];
    const availableRoomsByRoomId = {};

    const roomsWithAvailability = allRooms.map((room) => {
      const roomTotal = Number(room.totalRooms) || 1;
      const bookedCount = conflictingBookings
        .filter((b) => b.room.toString() === room._id.toString())
        .reduce((sum, b) => sum + (Number(b.roomsBooked) || 1), 0);

      const availableCount = Math.max(0, roomTotal - bookedCount);
      const isOccupied = availableCount <= 0;
      if (isOccupied) {
        occupiedRoomIds.push(room._id.toString());
      }
      availableRoomsByRoomId[room._id.toString()] = availableCount;

      const hasPassedDueDate = room.unavailableUntil && new Date(room.unavailableUntil) <= now;
      const isRoomAdminAvailable = hasPassedDueDate ? true : Boolean(room.isAvailable);

      // Also if checkIn date is before unavailableUntil date
      const isBlockedByDueDate =
        room.unavailableUntil && !hasPassedDueDate && checkInDate < new Date(room.unavailableUntil);

      return {
        ...room.toObject(),
        isAvailable: isRoomAdminAvailable,
        unavailableUntil: hasPassedDueDate ? null : room.unavailableUntil,
        totalRooms: roomTotal,
        bookedRoomsCount: bookedCount,
        availableRoomsCount: availableCount,
        location: room.location || 'Kasar Devi, Almora',
        isAvailableForDates: !isOccupied && isRoomAdminAvailable && !isBlockedByDueDate,
      };
    });

    res.status(200).json({
      checkIn,
      checkOut,
      totalRoomsCount: allRooms.length,
      occupiedCount: occupiedRoomIds.length,
      availableCount: allRooms.length - occupiedRoomIds.length,
      occupiedRoomIds,
      availableRoomsByRoomId,
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
    const { name, description, pricePerNight, view, totalRooms, location, unavailableUntil, unavailableReason, isAvailable } = req.body;
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
      view: view || '',
      capacity,
      amenities,
      imageURLs,
      totalRooms: Number(totalRooms) || 1,
      location: location || 'Kasar Devi, Almora',
      unavailableUntil: unavailableUntil ? new Date(unavailableUntil) : null,
      unavailableReason: unavailableReason || '',
      isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
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
    if (updateData.totalRooms !== undefined) {
      updateData.totalRooms = Number(updateData.totalRooms) || 1;
    }
    if (updateData.unavailableUntil !== undefined) {
      updateData.unavailableUntil = updateData.unavailableUntil ? new Date(updateData.unavailableUntil) : null;
    }
    if (updateData.isAvailable !== undefined) {
      updateData.isAvailable = updateData.isAvailable === true || updateData.isAvailable === 'true';
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

// @desc    Toggle room availability (enable/disable or set due date & inventory)
// @route   PUT /api/hotel/rooms/:id/toggle
// @access  Protected (Admin only)
const toggleRoomAvailability = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found.' });
    }

    if (req.body && Object.keys(req.body).length > 0) {
      if (req.body.isAvailable !== undefined) {
        room.isAvailable = Boolean(req.body.isAvailable);
      } else {
        room.isAvailable = !room.isAvailable;
      }

      if (req.body.unavailableUntil !== undefined) {
        room.unavailableUntil = req.body.unavailableUntil ? new Date(req.body.unavailableUntil) : null;
      } else if (room.isAvailable) {
        room.unavailableUntil = null;
      }

      if (req.body.unavailableReason !== undefined) {
        room.unavailableReason = req.body.unavailableReason;
      }

      if (req.body.totalRooms !== undefined) {
        room.totalRooms = Number(req.body.totalRooms) || room.totalRooms || 1;
      }

      if (req.body.location !== undefined) {
        room.location = req.body.location;
      }
    } else {
      room.isAvailable = !room.isAvailable;
      if (room.isAvailable) {
        room.unavailableUntil = null;
        room.unavailableReason = '';
      }
    }

    await room.save();

    res.status(200).json({
      message: `Room status updated successfully to ${room.isAvailable ? 'available' : 'unavailable'}.`,
      room,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// ============================
// BOOKING CONTROLLERS
// ============================

// @desc    Create a new hotel booking (with date conflict check & authoritative server pricing)
// @route   POST /api/hotel/bookings
// @access  Public
const createBooking = async (req, res) => {
  try {
    const { room, guestDetails, checkInDate, checkOutDate } = req.body;
    const requestedRooms = Math.max(1, parseInt(req.body.roomsBooked || 1, 10));

    // 1. Strict Date Validation
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      return res.status(400).json({ message: 'Invalid check-in or check-out date format.' });
    }

    if (checkIn < today) {
      return res.status(400).json({ message: 'Check-in date cannot be in the past.' });
    }

    if (checkIn >= checkOut) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date.' });
    }

    // 2. Fetch room data
    const roomData = await Room.findById(room);
    if (!roomData) {
      return res.status(404).json({ message: 'Room not found.' });
    }

    // Check for inventory availability on selected dates
    // Using start and end of day to flawlessly handle same-day check-in/check-out overlap
    const bCheckInStart = new Date(`${checkInDate}T23:59:59.999Z`);
    const bCheckOutEnd = new Date(`${checkOutDate}T00:00:00.000Z`);

    const conflictingBookings = await Booking.find({
      room: room,
      status: { $ne: 'cancelled' }, // Ignore cancelled bookings
      checkInDate: { $lt: bCheckOutEnd },
      checkOutDate: { $gt: bCheckInStart },
    }).select('roomsBooked');

    const totalInventory = Number(roomData.totalRooms) || 1;
    const currentlyBooked = conflictingBookings.reduce(
      (sum, b) => sum + (Number(b.roomsBooked) || 1),
      0
    );
    const availableInventory = Math.max(0, totalInventory - currentlyBooked);

    if (requestedRooms > availableInventory) {
      return res.status(409).json({
        message:
          availableInventory > 0
            ? `Only ${availableInventory} room(s) available for the selected dates. You requested ${requestedRooms}.`
            : 'This room is completely booked for the selected dates. Please choose another suite or alternative dates.',
        availableRooms: availableInventory,
        totalRooms: totalInventory,
      });
    }

    // Check if room is administratively unavailable or within unavailableUntil window
    const now = new Date();
    const hasPassedDueDate = roomData.unavailableUntil && new Date(roomData.unavailableUntil) <= now;
    const isRoomAdminAvailable = hasPassedDueDate ? true : Boolean(roomData.isAvailable);

    if (!isRoomAdminAvailable) {
      const dueStr = roomData.unavailableUntil
        ? ` until ${new Date(roomData.unavailableUntil).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
        : '';
      return res.status(400).json({
        message: `This suite is currently unavailable for bookings${dueStr} (${roomData.unavailableReason || 'No rooms left at this location'}).`,
      });
    }

    if (roomData.unavailableUntil && !hasPassedDueDate && checkIn < new Date(roomData.unavailableUntil)) {
      return res.status(400).json({
        message: `This suite is unavailable for check-in before ${new Date(roomData.unavailableUntil).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}.`,
      });
    }

    // 3. Authoritative server-side price calculation
    const siteSettings = await SiteSettings.findOne();
    const tariffResult = calculateStayTariff(
      roomData.pricePerNight,
      checkInDate,
      checkOutDate,
      siteSettings?.pricingRules || {}
    );
    // Multiply authoritative nightly tariff by the number of rooms booked
    const authoritativeTotal = tariffResult.totalAmount * requestedRooms;

    // Check if the request comes from an authenticated admin (e.g. Admin QuickBookingModal)
    let totalAmount = authoritativeTotal;
    let isAdminUser = false;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded && (decoded.role === 'admin' || decoded.role === 'superadmin' || decoded.id)) {
          isAdminUser = true;
        }
      } catch (tokenErr) {
        isAdminUser = false;
      }
    }

    // Only allow manual totalAmount override if request is from an authenticated admin
    if (isAdminUser && req.body.totalAmount !== undefined && Number(req.body.totalAmount) > 0) {
      totalAmount = Number(req.body.totalAmount);
    }

    const advancePaid = Number(req.body.advancePaid) || 0;
    const balanceDue = Math.max(0, totalAmount - advancePaid);
    const status = req.body.status || 'pending';
    const paymentMode = req.body.paymentMode || (advancePaid > 0 ? 'Cash' : 'Pending');
    const source = req.body.source || (isAdminUser ? 'Admin' : 'Website');
    const specialNotes = req.body.specialNotes || '';

    // Create the booking
    const booking = await Booking.create({
      room,
      roomsBooked: requestedRooms,
      guestDetails,
      checkInDate: checkIn,
      checkOutDate: checkOut,
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


