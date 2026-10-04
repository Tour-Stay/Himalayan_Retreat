const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  guestDetails: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  checkInDate: {
    type: Date,
    required: true
  },
  checkOutDate: {
    type: Date,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  advancePaid: {
    type: Number,
    default: 0
  },
  balanceDue: {
    type: Number,
    default: 0
  },
  paymentMode: {
    type: String,
    enum: ['Cash', 'UPI', 'Bank Transfer', 'Card', 'Pending'],
    default: 'Pending'
  },
  source: {
    type: String,
    default: 'Website'
  },
  specialNotes: {
    type: String,
    default: ''
  },
  folioExtras: [
    {
      item: { type: String, required: true },
      amount: { type: Number, required: true },
      addedAt: { type: Date, default: Date.now }
    }
  ],
  idProofUrl: {
    type: String,
    default: ''
  },
  idProofNumber: {
    type: String,
    default: ''
  },
  idProofType: {
    type: String,
    default: 'Aadhaar Card'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'checked_in', 'checked_out', 'completed', 'cancelled'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
