const mongoose = require('mongoose');

const tourPackageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  duration: {
    days: { type: Number, required: true },
    nights: { type: Number, required: true },
  },
  pricePerPerson: {
    type: Number,
    required: true,
  },
  itinerary: [
    {
      day: { type: Number, required: true },
      description: { type: String, required: true },
    }
  ],
  inclusions: [String],
  imageURLs: [String],
}, { timestamps: true });

module.exports = mongoose.model('TourPackage', tourPackageSchema);
