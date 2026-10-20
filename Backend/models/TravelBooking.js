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
  tripType: {
    type: String,
    enum: ['one-way', 'round-trip'],
    default: 'one-way',
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
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    default: 'Pending',
  },
  razorpayOrderId: {
    type: String
  },
  razorpayPaymentId: {
    type: String,
    unique: true,
    sparse: true,
  },
  razorpaySignature: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
  },
  dispatchDetails: {
    driverName: { type: String, default: '' },
    driverPhone: { type: String, default: '' },
    vehiclePlate: { type: String, default: '' },
    trainNumber: { type: String, default: '' },
    trainEta: { type: String, default: '' },
    luggageCount: { type: Number, default: 0 },
    fuelEstimate: { type: Number, default: 0 },
    driverAllowance: { type: Number, default: 0 },
    fareToCollect: { type: Number, default: 0 },
    dispatchNotes: { type: String, default: '' },
    dispatchedAt: { type: Date },
  },
}, { timestamps: true });

// Database Indexes for Performance & Security
travelBookingSchema.index({ packageId: 1 });
travelBookingSchema.index({ travelDate: 1 });
travelBookingSchema.index({ status: 1 });
travelBookingSchema.index({ razorpayPaymentId: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('TravelBooking', travelBookingSchema);
