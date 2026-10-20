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
    const filter = { isApproved: true };
    const category = req.query?.category || req.category;
    if (category) {
      filter.category = category;
    }
    const reviews = await TravelReview.find(filter)
      .select('-email')
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
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    const reviews = await TravelReview.find(filter).sort({ createdAt: -1 });
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
    const { name, email, location, tripType, stayedIn, category, rating, review } = req.body;

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
        console.error('Cloudinary upload failed:', cloudErr.message || cloudErr);
        return res.status(500).json({ message: 'Image upload failed. Please check Cloudinary credentials.', error: cloudErr.message });
      }
    }

    const newReview = await TravelReview.create({
      name,
      email,
      location: location || '',
      tripType: tripType || '',
      stayedIn: stayedIn || '',
      category: category || 'travel',
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

// @desc    Update an existing review (Admin protected or author verified)
// @route   PUT /api/travel/reviews/:id
// @access  Protected (Admin)
const updateReview = async (req, res) => {
  try {
    const { email, name, location, tripType, rating, review, isApproved } = req.body;

    const existingReview = await TravelReview.findById(req.params.id);
    if (!existingReview) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    // If caller is not an authenticated admin, enforce author email verification
    if (!req.admin) {
      if (!email || existingReview.email.toLowerCase() !== email.toLowerCase()) {
        return res.status(403).json({ message: 'You can only edit your own reviews. Email does not match.' });
      }
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
        console.error('Cloudinary upload failed:', cloudErr.message || cloudErr);
        return res.status(500).json({ message: 'Image upload failed. Please check Cloudinary credentials.', error: cloudErr.message });
      }
    }

    existingReview.name = name || existingReview.name;
    existingReview.location = location !== undefined ? location : existingReview.location;
    existingReview.tripType = tripType !== undefined ? tripType : existingReview.tripType;
    existingReview.rating = rating ? Number(rating) : existingReview.rating;
    existingReview.review = review || existingReview.review;
    existingReview.photos = photos;

    // Golden Rule of Moderation: Reset approval status so edited content must be re-vetted before going live
    if (req.admin && isApproved !== undefined) {
      existingReview.isApproved = Boolean(isApproved);
    } else {
      existingReview.isApproved = false;
    }

    await existingReview.save();

    res.status(200).json({ message: 'Review updated successfully and pending moderation.', review: existingReview });
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
