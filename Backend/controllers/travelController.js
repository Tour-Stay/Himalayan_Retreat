const TourPackage = require('../models/TourPackage');
const TravelBooking = require('../models/TravelBooking');
const { uploadToCloudinary } = require('../config/cloudinary');
const { sendTravelBookingEmail } = require('../config/emailService');

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

    // Upload images to Cloudinary (from memory, no local files)
    let imageURLs = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        uploadToCloudinary(file.buffer, 'tour-packages')
      );
      const results = await Promise.all(uploadPromises);
      imageURLs = results.map((result) => result.secure_url);
    }

    const tour = await TourPackage.create({
      title,
      destination,
      duration,
      pricePerPerson,
      itinerary,
      inclusions,
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

    const updatedTour = await TourPackage.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ message: 'Tour package updated successfully.', tour: updatedTour });
  } catch (error) {
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
    const { packageId, guestDetails, travelDate, travelers } = req.body;

    // Validate the tour package exists
    const tourPackage = await TourPackage.findById(packageId);
    if (!tourPackage) {
      return res.status(404).json({ message: 'Tour package not found.' });
    }

    // Calculate total amount
    const totalAmount = travelers * tourPackage.pricePerPerson;

    const booking = await TravelBooking.create({
      packageId,
      guestDetails,
      travelDate,
      travelers,
      totalAmount,
      paymentStatus: 'pending',
    });

    // Send confirmation email (non-blocking — don't fail booking if email fails)
    try {
      await sendTravelBookingEmail(booking, tourPackage);
    } catch (emailError) {
      console.error('Email sending failed:', emailError.message);
    }

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
    const bookings = await TravelBooking.find().populate('packageId', 'title destination pricePerPerson');
    res.status(200).json(bookings);
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
};
