const mongoose = require('mongoose');

const travelBookingSchema = new mongoose.Schema({
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TourPackage',
    required: false,
  },
  vehicleType: {
    type: String,
    enum: ['4-seater', '6-seater', '12-seater', 'custom'],
    default: '6-seater',
  },
  circuit: {
    type: String,
    default: 'Hill Stations & Temples',
  },
  pickupLocation: {
    type: String,
    default: 'Kathgodam / Kasar Devi',
  },
  tripDays: {
    type: Number,
    default: 1,
  },
  notes: {
    type: String,
    default: '',
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
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('TravelBooking', travelBookingSchema);
