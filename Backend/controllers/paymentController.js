const crypto = require('crypto');
const mongoose = require('mongoose');
const razorpayInstance = require('../config/razorpay');
const Booking = require('../models/Booking');
const TravelBooking = require('../models/TravelBooking');
const Room = require('../models/Room');
const TourPackage = require('../models/TourPackage');
const { sendHotelBookingEmail, sendAdminNewHotelBookingEmail, sendTravelBookingEmail, sendAdminNewTravelBookingEmail } = require('../config/emailService');

// Get Razorpay Key ID for Frontend
const getKey = (req, res) => {
  res.status(200).json({ key: process.env.RAZORPAY_KEY_ID });
};

// Create an order securely by retrieving authentic booking price from MongoDB
const createOrder = async (req, res) => {
  try {
    const { bookingId, receipt, bookingType = 'travel', currency = 'INR' } = req.body;
    const targetBookingId = bookingId || receipt;

    if (!targetBookingId) {
      return res.status(400).json({
        success: false,
        message: 'bookingId is required to create a payment order',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(targetBookingId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid bookingId format',
      });
    }

    // Securely retrieve the authoritative booking from MongoDB
    const Model = bookingType === 'hotel' ? Booking : TravelBooking;
    const booking = await Model.findById(targetBookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `Booking not found in ${bookingType} database`,
      });
    }

    if (booking.paymentStatus === 'Paid' || booking.status === 'confirmed') {
      return res.status(400).json({
        success: false,
        message: 'This booking has already been paid and confirmed',
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot create payment order for a cancelled booking',
      });
    }

    const verifiedAmount = Number(booking.totalAmount);
    if (!verifiedAmount || verifiedAmount <= 0 || isNaN(verifiedAmount)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking total amount in database',
      });
    }

    // Convert amount to smallest currency unit (paise for INR)
    const amountInPaise = Math.round(verifiedAmount * 100);

    const options = {
      amount: amountInPaise,
      currency,
      receipt: `${bookingType.slice(0, 5)}_${booking._id.toString()}`.slice(-40),
      notes: {
        bookingId: booking._id.toString(),
        bookingType,
      },
    };

    const order = await razorpayInstance.orders.create(options);

    if (!order) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create Razorpay order',
      });
    }

    // Link razorpayOrderId to the booking document
    booking.razorpayOrderId = order.id;
    await booking.save();

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error',
    });
  }
};

// Verify payment signature and cross-verify amount with MongoDB & Razorpay API
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
      receipt,
      bookingType = 'travel',
    } = req.body;

    const targetBookingId = bookingId || receipt;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !targetBookingId) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment verification details (orderId, paymentId, signature, or bookingId)',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(targetBookingId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid bookingId format',
      });
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error('❌ Server configuration error: RAZORPAY_KEY_SECRET is missing');
      return res.status(500).json({ success: false, message: 'Payment gateway configuration error' });
    }

    if (typeof razorpay_signature !== 'string') {
      return res.status(400).json({ success: false, message: 'Invalid signature format' });
    }

    // 1. Cryptographic HMAC-SHA256 signature verification with timingSafeEqual
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const expectedBuf = Buffer.from(expectedSignature, 'utf-8');
    const signatureBuf = Buffer.from(razorpay_signature, 'utf-8');

    const isAuthentic =
      expectedBuf.length === signatureBuf.length &&
      crypto.timingSafeEqual(expectedBuf, signatureBuf);

    if (!isAuthentic) {
      return res.status(400).json({
        success: false,
        message: 'Invalid signature. Payment verification failed',
      });
    }

    // 2. Query authoritative booking record from MongoDB
    const Model = bookingType === 'hotel' ? Booking : TravelBooking;
    const booking = await Model.findById(targetBookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found for payment confirmation',
      });
    }

    // 2.1 Replay Attack Prevention: Verify payment ID hasn't been used on another booking
    const existingHotelBooking = await Booking.findOne({ razorpayPaymentId: razorpay_payment_id });
    const existingTravelBooking = await TravelBooking.findOne({ razorpayPaymentId: razorpay_payment_id });
    const existingWithPayment = existingHotelBooking || existingTravelBooking;

    if (existingWithPayment && existingWithPayment._id.toString() !== targetBookingId.toString()) {
      console.error(
        `🚨 Security Alert: Payment replay attempt detected! razorpay_payment_id ${razorpay_payment_id} is already claimed by booking ${existingWithPayment._id}`
      );
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Payment ID has already been processed for another booking',
      });
    }

    const expectedAmountInPaise = Math.round(Number(booking.totalAmount) * 100);

    // 3. Query Razorpay API to fetch order and verify authentic amount paid
    let razorpayOrder;
    try {
      razorpayOrder = await razorpayInstance.orders.fetch(razorpay_order_id);
    } catch (orderFetchErr) {
      console.error('Error fetching Razorpay order from API:', orderFetchErr);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve order details from payment gateway',
      });
    }

    if (!razorpayOrder) {
      return res.status(400).json({
        success: false,
        message: 'Razorpay order could not be verified with payment gateway',
      });
    }

    // 3.1 Order Ownership Binding: Ensure Razorpay order notes match target booking
    if (razorpayOrder.notes?.bookingId && razorpayOrder.notes.bookingId !== targetBookingId.toString()) {
      console.error(
        `🚨 Security Alert: Razorpay order notes bookingId (${razorpayOrder.notes.bookingId}) does not match target booking (${targetBookingId})`
      );
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Order was not generated for this booking',
      });
    }

    // Verify order amount matches MongoDB booking total amount
    if (razorpayOrder.amount !== expectedAmountInPaise) {
      console.error(
        `🚨 Security Alert: Price tampering detected! Order amount: ${razorpayOrder.amount} paise, MongoDB booking expected: ${expectedAmountInPaise} paise`
      );
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Amount mismatch detected',
      });
    }

    // Verify payment details if payment can be fetched
    try {
      const payment = await razorpayInstance.payments.fetch(razorpay_payment_id);
      if (payment) {
        if (payment.order_id && payment.order_id !== razorpay_order_id) {
          console.error(`🚨 Security Alert: Payment order_id mismatch! Payment order: ${payment.order_id}, Request order: ${razorpay_order_id}`);
          return res.status(400).json({
            success: false,
            message: 'Payment verification failed: Payment order ID mismatch',
          });
        }
        if (payment.amount !== expectedAmountInPaise) {
          console.error(`🚨 Security Alert: Paid amount tampering! Paid: ${payment.amount}, Expected: ${expectedAmountInPaise}`);
          return res.status(400).json({
            success: false,
            message: 'Payment verification failed: Paid amount mismatch',
          });
        }
      }
    } catch (paymentFetchErr) {
      console.warn('Note: Direct payment fetch bypassed; verified order amount successfully:', paymentFetchErr.message);
    }

    const wasAlreadyConfirmed = booking.paymentStatus === 'Paid' && booking.status === 'confirmed';

    // 4. Update the database record
    booking.status = 'confirmed';
    booking.paymentStatus = 'Paid';
    booking.razorpayOrderId = razorpay_order_id;
    booking.razorpayPaymentId = razorpay_payment_id;
    booking.razorpaySignature = razorpay_signature;

    if (bookingType === 'hotel') {
      booking.advancePaid = booking.totalAmount;
      booking.balanceDue = 0;
      booking.paymentMode = 'Online (Razorpay)';
    }

    await booking.save();

    // 5. Send confirmation emails only if not already confirmed by webhook (avoids duplicates)
    if (!wasAlreadyConfirmed) {
      if (bookingType === 'hotel') {
        const roomData = await Room.findById(booking.room);
        try {
          await sendHotelBookingEmail(booking, roomData);
          await sendAdminNewHotelBookingEmail(booking, roomData);
        } catch (emailError) {
          console.error('Email sending failed after payment verification:', emailError.message);
        }
      } else {
        let tourPackage = {};
        if (booking.packageId) {
          try {
            tourPackage = (await TourPackage.findById(booking.packageId)) || {};
          } catch (pkgErr) {
            tourPackage = {};
          }
        }
        try {
          await sendTravelBookingEmail(booking, tourPackage);
          await sendAdminNewTravelBookingEmail(booking, tourPackage);
        } catch (emailError) {
          console.error('Travel email sending failed after payment verification:', emailError.message);
        }
      }
    }

    res.status(200).json({
      success: true,
      message: 'Payment successfully verified and database updated',
      bookingId: booking._id,
    });
  } catch (error) {
    if (error.code === 11000) {
      console.error('🚨 Duplicate payment ID detected by MongoDB unique constraint:', error.message);
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Payment ID has already been recorded for a booking',
      });
    }
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// =========================================================================
// RAZORPAY WEBHOOK HANDLER (Protects against dropped/interrupted connections)
// =========================================================================
const handleWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;

    if (!signature) {
      console.warn('⚠️ [Razorpay Webhook] Missing x-razorpay-signature header');
      return res.status(400).json({ status: 'error', message: 'Missing signature header' });
    }

    if (!webhookSecret) {
      console.error('❌ [Razorpay Webhook] Neither RAZORPAY_WEBHOOK_SECRET nor RAZORPAY_KEY_SECRET is configured');
      return res.status(500).json({ status: 'error', message: 'Webhook secret not configured' });
    }

    // 1. Verify webhook signature using constant-time comparison on raw body
    const rawPayload = req.rawBody ? req.rawBody.toString('utf8') : JSON.stringify(req.body);
    let isValid = false;

    try {
      const Razorpay = require('razorpay');
      isValid = Razorpay.validateWebhookSignature(rawPayload, signature, webhookSecret);
    } catch (sdkErr) {
      // Fallback constant-time HMAC comparison
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawPayload)
        .digest('hex');

      const expectedBuf = Buffer.from(expectedSignature, 'utf-8');
      const signatureBuf = Buffer.from(signature, 'utf-8');

      isValid =
        expectedBuf.length === signatureBuf.length &&
        crypto.timingSafeEqual(expectedBuf, signatureBuf);
    }

    if (!isValid) {
      console.error('🚨 [Razorpay Webhook] Invalid webhook signature detected!');
      return res.status(400).json({ status: 'error', message: 'Invalid webhook signature' });
    }

    const event = req.body.event;
    console.log(`🔔 [Razorpay Webhook] Received authentic event: ${event}`);

    // Process payment.captured and order.paid events
    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = req.body.payload?.payment?.entity;
      const orderEntity = req.body.payload?.order?.entity;

      const orderId = paymentEntity?.order_id || orderEntity?.id;
      const paymentId = paymentEntity?.id;
      const paidAmountInPaise = paymentEntity?.amount || orderEntity?.amount_paid || orderEntity?.amount;

      // Extract metadata notes
      const notes = paymentEntity?.notes || orderEntity?.notes || {};
      const bookingId = notes.bookingId;
      const bookingType = notes.bookingType || 'travel';

      let booking = null;
      let actualType = bookingType;

      // 1. Try finding booking by notes.bookingId
      if (bookingId && mongoose.Types.ObjectId.isValid(bookingId)) {
        if (bookingType === 'hotel') {
          booking = await Booking.findById(bookingId);
        } else {
          booking = await TravelBooking.findById(bookingId);
        }
      }

      // 2. If not found by notes, look up via razorpayOrderId
      if (!booking && orderId) {
        booking = await Booking.findOne({ razorpayOrderId: orderId });
        if (booking) {
          actualType = 'hotel';
        } else {
          booking = await TravelBooking.findOne({ razorpayOrderId: orderId });
          if (booking) {
            actualType = 'travel';
          }
        }
      }

      if (!booking) {
        console.warn(`⚠️ [Razorpay Webhook] No matching booking found for order: ${orderId}, bookingId: ${bookingId}`);
        // Return 200 OK so Razorpay stops retrying for unlinked events
        return res.status(200).json({ status: 'ok', message: 'Booking not found, event acknowledged' });
      }

      // Idempotency check: If user's browser already verified and confirmed, do not double-process
      if (booking.paymentStatus === 'Paid' && booking.status === 'confirmed') {
        console.log(`ℹ️ [Razorpay Webhook] Booking ${booking._id} already confirmed & paid. Idempotent skip.`);
        return res.status(200).json({ status: 'ok', message: 'Already processed' });
      }

      // 2.3 Replay Attack Prevention in Webhook: Ensure paymentId is not claimed by another booking
      if (paymentId) {
        const existingHotel = await Booking.findOne({ razorpayPaymentId: paymentId });
        const existingTravel = await TravelBooking.findOne({ razorpayPaymentId: paymentId });
        const existingWithPayment = existingHotel || existingTravel;

        if (existingWithPayment && existingWithPayment._id.toString() !== booking._id.toString()) {
          console.error(
            `🚨 [Razorpay Webhook] Security Alert: Payment replay attempt detected! paymentId ${paymentId} already claimed by booking ${existingWithPayment._id}`
          );
          return res.status(400).json({
            status: 'error',
            message: 'Payment ID already processed for another booking',
          });
        }
      }

      // 3. Security cross-verification: Ensure paid amount matches expected database amount
      const expectedAmountInPaise = Math.round(Number(booking.totalAmount) * 100);
      if (paidAmountInPaise && paidAmountInPaise < expectedAmountInPaise) {
        console.error(
          `🚨 [Razorpay Webhook] Security Alert: Underpayment detected! Paid: ${paidAmountInPaise}, Expected: ${expectedAmountInPaise}`
        );
        return res.status(400).json({ status: 'error', message: 'Underpayment detected' });
      }

      // 4. Update booking to confirmed and Paid (recovers interrupted/dropped transactions)
      booking.status = 'confirmed';
      booking.paymentStatus = 'Paid';
      if (orderId) booking.razorpayOrderId = orderId;
      if (paymentId) booking.razorpayPaymentId = paymentId;
      booking.razorpaySignature = signature;

      if (actualType === 'hotel') {
        booking.advancePaid = booking.totalAmount;
        booking.balanceDue = 0;
        booking.paymentMode = 'Online (Razorpay Webhook)';
      }

      await booking.save();
      console.log(`✅ [Razorpay Webhook] Booking ${booking._id} marked as Paid & confirmed via webhook!`);

      // 5. Dispatch confirmation emails directly from server
      if (actualType === 'hotel') {
        const roomData = await Room.findById(booking.room);
        try {
          await sendHotelBookingEmail(booking, roomData);
          await sendAdminNewHotelBookingEmail(booking, roomData);
          console.log(`📧 [Razorpay Webhook] Confirmation emails dispatched for hotel booking ${booking._id}`);
        } catch (emailError) {
          console.error('[Razorpay Webhook] Hotel email sending failed:', emailError.message);
        }
      } else {
        let tourPackage = {};
        if (booking.packageId) {
          try {
            tourPackage = (await TourPackage.findById(booking.packageId)) || {};
          } catch (pkgErr) {
            tourPackage = {};
          }
        }
        try {
          await sendTravelBookingEmail(booking, tourPackage);
          await sendAdminNewTravelBookingEmail(booking, tourPackage);
          console.log(`📧 [Razorpay Webhook] Confirmation emails dispatched for travel booking ${booking._id}`);
        } catch (emailError) {
          console.error('[Razorpay Webhook] Travel email sending failed:', emailError.message);
        }
      }
    } else if (event === 'payment.failed') {
      const paymentEntity = req.body.payload?.payment?.entity;
      const orderId = paymentEntity?.order_id;
      const notes = paymentEntity?.notes || {};
      const bookingId = notes.bookingId;

      console.warn(`⚠️ [Razorpay Webhook] Payment failed event received for order: ${orderId}`);
      if (bookingId && mongoose.Types.ObjectId.isValid(bookingId)) {
        await Booking.updateOne(
          { _id: bookingId, paymentStatus: 'Pending' },
          { $set: { paymentStatus: 'Failed' } }
        );
        await TravelBooking.updateOne(
          { _id: bookingId, paymentStatus: 'Pending' },
          { $set: { paymentStatus: 'Failed' } }
        );
      }
    }

    return res.status(200).json({ status: 'ok', received: true });
  } catch (error) {
    if (error.code === 11000) {
      console.error('🚨 [Razorpay Webhook] Duplicate payment ID detected by MongoDB unique constraint:', error.message);
      return res.status(200).json({ status: 'ok', message: 'Duplicate payment ID already recorded' });
    }
    console.error('❌ [Razorpay Webhook] Error processing webhook:', error);
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getKey,
  handleWebhook,
};
