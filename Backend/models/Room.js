const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  pricePerNight: {
    type: Number,
    required: true,
  },
  capacity: {
    adults: { type: Number, default: 2 },
    children: { type: Number, default: 0 }
  },
  amenities: [String],
  view: {
    type: String,
    default: '',
  },
  imageURLs: [String], // Array of image URLs
  isAvailable: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
