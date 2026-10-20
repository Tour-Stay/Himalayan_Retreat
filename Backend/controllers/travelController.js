const TourPackage = require('../models/TourPackage');
const TravelBooking = require('../models/TravelBooking');
const SiteSettings = require('../models/SiteSettings');
const { calculateCabFare } = require('../config/pricingEngine');
const jwt = require('jsonwebtoken');
const { uploadToCloudinary } = require('../config/cloudinary');

// ================================
// TOUR PACKAGE CONTROLLERS (CRUD)
// ================================

// @desc    Get all tour packages
// @route   GET /api/travel/tours
// @access  Public
const getAllTours = async (req, res) => {
  try {
    const tours = await TourPackage.find();
    res.status(200).json(tours);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// @desc    Get a single tour package by ID
// @route   GET /api/travel/tours/:id
// @access  Public
const getTourById = async (req, res) => {
  try {
    const tour = await TourPackage.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ message: 'Tour package not found.' });
    }
    res.status(200).json(tour);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// @desc    Add a new tour package
// @route   POST /api/travel/tours
// @access  Protected (Admin only)
const addTour = async (req, res) => {
  try {
    const { title, destination, duration, pricePerPerson, itinerary, inclusions } = req.body;

    // Upload images to Cloudinary (with automatic base64 fallback if Cloudinary credentials fail)
    let imageURLs = [];
    if (req.files && req.files.length > 0) {
      try {
        const uploadPromises = req.files.map((file) =>
          uploadToCloudinary(file.buffer, 'tour-packages')
        );
        const results = await Promise.all(uploadPromises);
        imageURLs = results.map((result) => result.secure_url);
      } catch (cloudErr) {
        console.error('Cloudinary upload failed:', cloudErr.message || cloudErr);
        return res.status(500).json({ message: 'Image upload failed. Please check Cloudinary credentials.', error: cloudErr.message });
      }
    }

    let parsedDuration = duration;
    if (typeof parsedDuration === 'string') {
      try {
        parsedDuration = JSON.parse(parsedDuration);
      } catch (e) {
        const dMatch = parsedDuration.match(/(\d+)\s*Day/i);
        const nMatch = parsedDuration.match(/(\d+)\s*Night/i);
        parsedDuration = {
          days: dMatch ? Number(dMatch[1]) : 1,
          nights: nMatch ? Number(nMatch[1]) : 0,
        };
      }
    }

    let parsedItinerary = itinerary;
    if (typeof parsedItinerary === 'string') {
      try {
        parsedItinerary = JSON.parse(parsedItinerary);
      } catch (e) {
        parsedItinerary = [{ day: 1, description: parsedItinerary }];
      }
    }

    let parsedInclusions = inclusions;
    if (typeof parsedInclusions === 'string') {
      try {
        parsedInclusions = JSON.parse(parsedInclusions);
      } catch (e) {
        parsedInclusions = parsedInclusions.split(',').map((s) => s.trim()).filter(Boolean);
      }
    }

    const tour = await TourPackage.create({
      title,
      destination,
      duration: parsedDuration,
      pricePerPerson,
      itinerary: parsedItinerary,
      inclusions: parsedInclusions,
      imageURLs,
    });

    res.status(201).json({ message: 'Tour package added successfully.', tour });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// @desc    Update a tour package
// @route   PUT /api/travel/tours/:id
// @access  Protected (Admin only)
const updateTour = async (req, res) => {
  try {
    const tour = await TourPackage.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ message: 'Tour package not found.' });
    }

    const updateData = { ...req.body };

    // Parse string fields from FormData
    if (updateData.duration && typeof updateData.duration === 'string') {
      try {
        updateData.duration = JSON.parse(updateData.duration);
      } catch (e) {
        const dMatch = updateData.duration.match(/(\d+)\s*Day/i);
        const nMatch = updateData.duration.match(/(\d+)\s*Night/i);
        updateData.duration = {
          days: dMatch ? Number(dMatch[1]) : 1,
          nights: nMatch ? Number(nMatch[1]) : 0,
        };
      }
    }
    if (updateData.itinerary && typeof updateData.itinerary === 'string') {
      try {
        updateData.itinerary = JSON.parse(updateData.itinerary);
      } catch (e) {
        updateData.itinerary = [{ day: 1, description: updateData.itinerary }];
      }
    }
    if (updateData.inclusions && typeof updateData.inclusions === 'string') {
      try {
        updateData.inclusions = JSON.parse(updateData.inclusions);
      } catch (e) {
        updateData.inclusions = updateData.inclusions.split(',').map((s) => s.trim()).filter(Boolean);
      }
    }

    // Handle new image uploads if provided
    if (req.files && req.files.length > 0) {
      let newImageURLs = [];
      try {
        const uploadPromises = req.files.map((file) =>
          uploadToCloudinary(file.buffer, 'tour-packages')
        );
        const results = await Promise.all(uploadPromises);
        newImageURLs = results.map((result) => result.secure_url);
      } catch (cloudErr) {
        console.error('Cloudinary upload failed:', cloudErr.message || cloudErr);
        return res.status(500).json({ message: 'Image upload failed. Please check Cloudinary credentials.', error: cloudErr.message });
      }
      updateData.imageURLs = newImageURLs;
    }

    const updatedTour = await TourPackage.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ message: 'Tour package updated successfully.', tour: updatedTour });
  } catch (error) {
    console.error('Update Tour Error:', error);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// @desc    Delete a tour package
// @route   DELETE /api/travel/tours/:id
// @access  Protected (Admin only)
const deleteTour = async (req, res) => {
  try {
    const tour = await TourPackage.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ message: 'Tour package not found.' });
    }

    await TourPackage.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Tour package deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// ================================
// TRAVEL BOOKING CONTROLLERS
// ================================

// @desc    Create a new travel booking
// @route   POST /api/travel/bookings
// @access  Public
const createTravelBooking = async (req, res) => {
  try {
    const {
      packageId,
      vehicleType,
      circuit,
      pickupLocation,
      tripDays,
      tripType,
      notes,
      guestDetails,
      travelDate,
      travelers,
      totalAmount: clientAmount,
    } = req.body;

    // 1. Strict Input & Date Validation
    const validTravelers = Math.max(1, parseInt(travelers, 10) || 1);
    const validTripDays = Math.max(1, parseInt(tripDays, 10) || 1);
    const normalizedTripType = tripType === 'round-trip' || validTripDays > 1 ? 'round-trip' : 'one-way';

    const parsedTravelDate = new Date(travelDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(parsedTravelDate.getTime())) {
      return res.status(400).json({ message: 'Invalid travel date format.' });
    }

    if (parsedTravelDate < today) {
      return res.status(400).json({ message: 'Travel date cannot be in the past.' });
    }

    // 2. Authoritative Price Calculation
    let tourPackage = null;
    let authoritativeAmount = 0;

    if (packageId) {
      tourPackage = await TourPackage.findById(packageId);
      if (!tourPackage) {
        return res.status(404).json({ message: 'Tour package not found.' });
      }
      authoritativeAmount = validTravelers * (Number(tourPackage.pricePerPerson) || 0);
    } else {
      // Custom cab transfer: Calculate authoritative fare on server
      const siteSettings = await SiteSettings.findOne();
      authoritativeAmount = calculateCabFare(
        {
          vehicleType: vehicleType || '6-seater',
          circuit: circuit || '',
          tripDays: validTripDays,
          travelers: validTravelers,
          tripType: normalizedTripType,
        },
        siteSettings || {}
      );
    }

    // 3. Admin Override Check
    let finalAmount = authoritativeAmount;
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
    if (isAdminUser && clientAmount !== undefined && Number(clientAmount) > 0) {
      finalAmount = Number(clientAmount);
    }

    const booking = await TravelBooking.create({
      packageId: packageId || undefined,
      vehicleType: vehicleType || '6-seater',
      circuit: circuit || 'Hill Stations & Temples',
      pickupLocation: pickupLocation || 'Kathgodam / Kasar Devi',
      tripDays: validTripDays,
      tripType: normalizedTripType,
      notes: notes || '',
      guestDetails,
      travelDate: parsedTravelDate,
      travelers: validTravelers,
      totalAmount: finalAmount,
      paymentStatus: 'Pending',
    });

    res.status(201).json({ message: 'Travel booking created successfully.', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// @desc    Get all travel bookings
// @route   GET /api/travel/bookings
// @access  Protected (Admin only)
const getAllTravelBookings = async (req, res) => {
  try {
    const bookings = await TravelBooking.find()
      .populate('packageId', 'title destination pricePerPerson')
      .sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// @desc    Update travel booking status
// @route   PUT /api/travel/bookings/:id/status
// @access  Protected (Admin only)
const updateTravelBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await TravelBooking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!booking) {
      return res.status(404).json({ message: 'Travel booking not found.' });
    }
    res.status(200).json({ message: 'Travel booking status updated.', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// @desc    Delete a travel booking
// @route   DELETE /api/travel/bookings/:id
// @access  Protected (Admin only)
const deleteTravelBooking = async (req, res) => {
  try {
    const booking = await TravelBooking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Travel booking not found.' });
    }
    res.status(200).json({ message: 'Travel booking deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// @desc    Update travel booking payment status
// @route   PUT /api/travel/bookings/:id/payment
// @access  Protected (Admin only)
const updateTravelPaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const booking = await TravelBooking.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true }
    );
    if (!booking) {
      return res.status(404).json({ message: 'Travel booking not found.' });
    }
    res.status(200).json({ message: 'Payment status updated.', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// @desc    Dispatch travel booking / assign driver
// @route   PUT /api/travel/bookings/:id/dispatch
// @access  Protected (Admin only)
const dispatchTravelBooking = async (req, res) => {
  try {
    const {
      driverName,
      driverPhone,
      vehiclePlate,
      trainNumber,
      trainEta,
      luggageCount,
      fuelEstimate,
      driverAllowance,
      fareToCollect,
      dispatchNotes,
    } = req.body;

    const booking = await TravelBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Travel booking not found.' });
    }

    booking.dispatchDetails = {
      driverName: driverName !== undefined ? driverName : (booking.dispatchDetails?.driverName || ''),
      driverPhone: driverPhone !== undefined ? driverPhone : (booking.dispatchDetails?.driverPhone || ''),
      vehiclePlate: vehiclePlate !== undefined ? vehiclePlate : (booking.dispatchDetails?.vehiclePlate || ''),
      trainNumber: trainNumber !== undefined ? trainNumber : (booking.dispatchDetails?.trainNumber || ''),
      trainEta: trainEta !== undefined ? trainEta : (booking.dispatchDetails?.trainEta || ''),
      luggageCount: luggageCount !== undefined ? Number(luggageCount) : (booking.dispatchDetails?.luggageCount || 0),
      fuelEstimate: fuelEstimate !== undefined ? Number(fuelEstimate) : (booking.dispatchDetails?.fuelEstimate || 0),
      driverAllowance: driverAllowance !== undefined ? Number(driverAllowance) : (booking.dispatchDetails?.driverAllowance || 0),
      fareToCollect: fareToCollect !== undefined ? Number(fareToCollect) : (booking.dispatchDetails?.fareToCollect || booking.totalAmount || 0),
      dispatchNotes: dispatchNotes !== undefined ? dispatchNotes : (booking.dispatchDetails?.dispatchNotes || ''),
      dispatchedAt: new Date(),
    };

    // Auto-confirm booking if it was still pending
    if (booking.status === 'pending') {
      booking.status = 'confirmed';
    }

    await booking.save();
    res.status(200).json({ message: 'Driver dispatched and booking updated successfully.', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

module.exports = {
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
};
