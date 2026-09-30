const TravelReview = require('../models/TravelReview');
const { uploadToCloudinary } = require('../config/cloudinary');
const { sendReviewThankYouEmail } = require('../config/emailService');

// ================================
// TRAVEL REVIEW CONTROLLERS
// ================================

// @desc    Get all approved travel reviews
// @route   GET /api/travel/reviews
// @access  Public
const getAllReviews = async (req, res) => {
  try {
    const reviews = await TravelReview.find({ isApproved: true })
      .sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// @desc    Get ALL travel reviews (Admin only - includes unapproved)
// @route   GET /api/travel/reviews/admin
// @access  Protected (Admin)
const getAdminReviews = async (req, res) => {
  try {
    const reviews = await TravelReview.find().sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// @desc    Create a new travel review (with optional photo uploads)
// @route   POST /api/travel/reviews
// @access  Public
const createReview = async (req, res) => {
  try {
    const { name, email, location, tripType, rating, review } = req.body;

    if (!name || !email || !review) {
      return res.status(400).json({ message: 'Name, email, and review text are required.' });
    }

    // Upload photos to Cloudinary if provided
    let photos = [];
    if (req.files && req.files.length > 0) {
      try {
        const uploadPromises = req.files.map((file) =>
          uploadToCloudinary(file.buffer, 'travel-reviews')
        );
        const results = await Promise.all(uploadPromises);
        photos = results.map((result) => result.secure_url);
      } catch (cloudErr) {
        console.warn('⚠️ Cloudinary upload warning (using base64 fallback):', cloudErr.message || cloudErr);
        // Fallback: convert file buffer to base64 data URI
        photos = req.files.map((file) => {
          const mime = file.mimetype || 'image/jpeg';
          return `data:${mime};base64,${file.buffer.toString('base64')}`;
        });
      }
    }

    const newReview = await TravelReview.create({
      name,
      email,
      location: location || '',
      tripType: tripType || '',
      rating: Number(rating) || 5,
      review,
      photos,
    });

    // Send thank-you email (non-blocking — don't fail review if email fails)
    try {
      await sendReviewThankYouEmail(newReview);
    } catch (emailError) {
      console.error('Review thank-you email failed:', emailError.message);
    }

    res.status(201).json({ message: 'Review submitted successfully!', review: newReview });
  } catch (error) {
    console.error('Create Review Error:', error);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// @desc    Update an existing review (only if email matches the original author)
// @route   PUT /api/travel/reviews/:id
// @access  Public (email-verified)
const updateReview = async (req, res) => {
  try {
    const { email, name, location, tripType, rating, review } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required to verify ownership.' });
    }

    const existingReview = await TravelReview.findById(req.params.id);
    if (!existingReview) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    // Verify ownership via email match
    if (existingReview.email.toLowerCase() !== email.toLowerCase()) {
      return res.status(403).json({ message: 'You can only edit your own reviews. Email does not match.' });
    }

    // Upload new photos if provided
    let photos = existingReview.photos;
    if (req.files && req.files.length > 0) {
      try {
        const uploadPromises = req.files.map((file) =>
          uploadToCloudinary(file.buffer, 'travel-reviews')
        );
        const results = await Promise.all(uploadPromises);
        const newPhotos = results.map((result) => result.secure_url);
        photos = [...photos, ...newPhotos]; // Append new photos to existing
      } catch (cloudErr) {
        console.warn('⚠️ Cloudinary upload warning (using base64 fallback):', cloudErr.message || cloudErr);
        const newPhotos = req.files.map((file) => {
          const mime = file.mimetype || 'image/jpeg';
          return `data:${mime};base64,${file.buffer.toString('base64')}`;
        });
        photos = [...photos, ...newPhotos];
      }
    }

    existingReview.name = name || existingReview.name;
    existingReview.location = location !== undefined ? location : existingReview.location;
    existingReview.tripType = tripType !== undefined ? tripType : existingReview.tripType;
    existingReview.rating = rating ? Number(rating) : existingReview.rating;
    existingReview.review = review || existingReview.review;
    existingReview.photos = photos;

    await existingReview.save();

    res.status(200).json({ message: 'Review updated successfully.', review: existingReview });
  } catch (error) {
    console.error('Update Review Error:', error);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// @desc    Toggle review approval status (Admin only)
// @route   PUT /api/travel/reviews/:id/approve
// @access  Protected (Admin)
const toggleReviewApproval = async (req, res) => {
  try {
    const review = await TravelReview.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    review.isApproved = !review.isApproved;
    await review.save();
    
    res.status(200).json({ message: `Review ${review.isApproved ? 'approved' : 'hidden'} successfully.`, review });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// @desc    Delete a review (Admin only)
// @route   DELETE /api/travel/reviews/:id
// @access  Protected (Admin)
const deleteReview = async (req, res) => {
  try {
    const review = await TravelReview.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    await TravelReview.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Review deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

module.exports = {
  getAllReviews,
  getAdminReviews,
  createReview,
  updateReview,
  toggleReviewApproval,
  deleteReview,
};
