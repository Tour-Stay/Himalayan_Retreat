const mongoose = require('mongoose');

const travelReviewSchema = new mongoose.Schema({
  // Author identity (email used for edit authorization)
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  location: {
    type: String,
    trim: true,
    default: '',
  },
  tripType: {
    type: String,
    trim: true,
    default: '',
  },
  stayedIn: {
    type: String,
    trim: true,
    default: '',
  },
  category: {
    type: String,
    enum: ['hotel', 'travel', 'general'],
    default: 'travel',
  },

  // Review content
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    default: 5,
  },
  review: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000,
  },
  comment: {
    type: String,
    trim: true,
  },

  // Photo URLs (uploaded to Cloudinary)
  photos: [{
    type: String,
  }],

  // Moderation
  isApproved: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// Index for quick lookups by email (for edit authorization)
travelReviewSchema.index({ email: 1 });

module.exports = mongoose.model('TravelReview', travelReviewSchema);
