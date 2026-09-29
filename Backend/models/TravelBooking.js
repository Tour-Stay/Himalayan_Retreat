const mongoose = require('mongoose');

const travelBookingSchema = new mongoose.Schema({
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TourPackage',
    required: true,
  },
  guestDetails: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  travelDate: {
    type: Date,
    required: true,
  },
  travelers: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('TravelBooking', travelBookingSchema);
