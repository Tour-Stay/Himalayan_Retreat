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
  },
  totalRooms: {
    type: Number,
    default: 1,
  },
  location: {
    type: String,
    default: 'Kasar Devi, Almora',
  },
  unavailableUntil: {
    type: Date,
    default: null,
  },
  unavailableReason: {
    type: String,
    default: '',
  }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
