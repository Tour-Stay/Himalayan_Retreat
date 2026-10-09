const crypto = require('crypto');
const razorpayInstance = require('../config/razorpay');
const Booking = require('../models/Booking');
const TravelBooking = require('../models/TravelBooking');
const Room = require('../models/Room');
const { sendHotelBookingEmail, sendAdminNewHotelBookingEmail } = require('../config/emailService');

// Get Razorpay Key ID for Frontend
const getKey = (req, res) => {
  res.status(200).json({ key: process.env.RAZORPAY_KEY_ID });
};

// Create an order
const createOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;
    
    if (!amount) {
      return res.status(400).json({ success: false, message: 'Amount is required' });
    }

    const options = {
      amount: Math.round(amount * 100), // amount in smallest currency unit (paise)
      currency,
      receipt: receipt || `receipt_${Date.now()}`
    };

    const order = await razorpayInstance.orders.create(options);
    
    if (!order) {
      return res.status(500).json({ success: false, message: 'Failed to create Razorpay order' });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Verify payment signature
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId, bookingType = 'travel' } = req.body;
    
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment details' });
    }
    
    // Create the expected signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Payment is verified, update the database
      if (bookingId) {
        const updateData = {
          status: 'confirmed',
          paymentStatus: 'Paid',
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature
        };

        if (bookingType === 'hotel') {
          const updatedBooking = await Booking.findByIdAndUpdate(bookingId, updateData, { new: true });
          
          if (updatedBooking) {
            const roomData = await Room.findById(updatedBooking.room);
            // Send final booking confirmation email with PDF receipt
            try {
              await sendHotelBookingEmail(updatedBooking, roomData);
              await sendAdminNewHotelBookingEmail(updatedBooking, roomData);
            } catch (emailError) {
              console.error('Email sending failed after payment verification:', emailError.message);
            }
          }
        } else {
          await TravelBooking.findByIdAndUpdate(bookingId, updateData);
        }
      }

      res.status(200).json({
        success: true,
        message: 'Payment successfully verified and database updated',
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid signature. Payment verification failed',
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getKey
};
