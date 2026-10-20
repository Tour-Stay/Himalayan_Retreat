const crypto = require('crypto');
const mongoose = require('mongoose');
const razorpayInstance = require('../config/razorpay');
const Booking = require('../models/Booking');
const TravelBooking = require('../models/TravelBooking');
const Room = require('../models/Room');
const TourPackage = require('../models/TourPackage');
const { sendHotelBookingEmail, sendAdminNewHotelBookingEmail, sendTravelBookingEmail, sendAdminNewTravelBookingEmail } = require('../config/emailService');

// Centralized, idempotent email dispatchers for hotel and travel confirmations
const dispatchConfirmationEmails = async (booking, bookingType) => {
  if (bookingType === 'hotel') {
    try {
      const roomData = await Room.findById(booking.room);
      if (roomData) {
        await sendHotelBookingEmail(booking, roomData);
        await sendAdminNewHotelBookingEmail(booking, roomData);
        console.log(`📧 [Email Service] Hotel booking confirmation emails dispatched for ${booking._id}`);
      }
    } catch (emailError) {
      console.error('❌ [Email Service] Hotel email sending failed:', emailError.message);
    }
  } else {
    try {
      let tourPackage = {};
      if (booking.packageId) {
        try {
          tourPackage = (await TourPackage.findById(booking.packageId)) || {};
        } catch (pkgErr) {
          tourPackage = {};
        }
      }
      await sendTravelBookingEmail(booking, tourPackage);
      await sendAdminNewTravelBookingEmail(booking, tourPackage);
      console.log(`📧 [Email Service] Travel booking confirmation emails dispatched for ${booking._id}`);
    } catch (emailError) {
      console.error('❌ [Email Service] Travel email sending failed:', emailError.message);
    }
  }
};

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

    // Enforce 15-minute reservation hold timeout
    const holdDurationMs = 15 * 60 * 1000;
    const bookingAgeMs = Date.now() - new Date(booking.createdAt).getTime();

    if (booking.status === 'cancelled' || (booking.status === 'pending' && bookingAgeMs > holdDurationMs)) {
      if (booking.status === 'pending') {
        booking.status = 'cancelled';
        booking.specialNotes = 'Auto-cancelled due to payment timeout (15 mins)';
        await booking.save();
      }
      return res.status(400).json({
        success: false,
        message: 'The 15-minute reservation hold has expired. Please select your room and dates again.',
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
      currency: 'INR',
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

    const holdExpiresAt = new Date(new Date(booking.createdAt).getTime() + holdDurationMs).toISOString();

    res.status(200).json({
      success: true,
      order,
      holdExpiresAt,
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

    // Verify order currency & amount match MongoDB booking total amount
    if (razorpayOrder.currency !== 'INR') {
      console.error(
        `🚨 Security Alert: Currency tampering detected! Order currency: ${razorpayOrder.currency}, expected: INR`
      );
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Invalid currency detected',
      });
    }

    if (razorpayOrder.amount !== expectedAmountInPaise) {
      console.error(
        `🚨 Security Alert: Price tampering detected! Order amount: ${razorpayOrder.amount} paise, MongoDB booking expected: ${expectedAmountInPaise} paise`
      );
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Amount mismatch detected',
      });
    }

    // 3.2 Authoritative Gateway Verification: Query payment entity directly from Razorpay (Fail-Closed)
    let payment;
    try {
      payment = await razorpayInstance.payments.fetch(razorpay_payment_id);
    } catch (paymentFetchErr) {
      console.error('🚨 [Payment Verify] Error fetching payment from gateway:', paymentFetchErr.message || paymentFetchErr);
      return res.status(502).json({
        success: false,
        message: 'Payment verification is taking longer than expected with the payment gateway. Please check back shortly.',
      });
    }

    if (!payment) {
      return res.status(400).json({
        success: false,
        message: 'Payment record could not be retrieved from payment gateway',
      });
    }

    if (payment.order_id && payment.order_id !== razorpay_order_id) {
      console.error(`🚨 Security Alert: Payment order_id mismatch! Payment order: ${payment.order_id}, Request order: ${razorpay_order_id}`);
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Payment order ID mismatch',
      });
    }

    if (payment.currency && payment.currency !== 'INR') {
      console.error(`🚨 Security Alert: Paid currency tampering! Paid: ${payment.currency}, Expected: INR`);
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Paid currency mismatch',
      });
    }

    if (payment.amount !== expectedAmountInPaise) {
      console.error(`🚨 Security Alert: Paid amount tampering! Paid: ${payment.amount}, Expected: ${expectedAmountInPaise}`);
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Paid amount mismatch',
      });
    }

    // Require that the payment has officially been captured by the gateway
    if (payment.status !== 'captured') {
      console.warn(`⚠️ [Payment Verify] Payment ${razorpay_payment_id} is not captured. Current status: ${payment.status}`);
      return res.status(400).json({
        success: false,
        message: `Payment verification failed: Payment status is '${payment.status}', not captured.`,
      });
    }

    // 3.3 Late Payment on Cancelled/Expired Hold: Enforce Strict Zero Overbooking Policy
    if (booking.status === 'cancelled') {
      if (bookingType === 'hotel') {
        const Room = require('../models/Room');
        const roomData = await Room.findById(booking.room);
        const totalInventory = Number(roomData?.totalRooms) || 1;
        const requestedRooms = Math.max(1, parseInt(booking.roomsBooked || 1, 10));

        const checkInDateStr = new Date(booking.checkInDate).toISOString().split('T')[0];
        const checkOutDateStr = new Date(booking.checkOutDate).toISOString().split('T')[0];
        const bCheckInStart = new Date(`${checkInDateStr}T23:59:59.999Z`);
        const bCheckOutEnd = new Date(`${checkOutDateStr}T00:00:00.000Z`);

        const conflictingBookings = await Booking.find({
          _id: { $ne: booking._id },
          room: booking.room,
          status: { $ne: 'cancelled' },
          checkInDate: { $lt: bCheckOutEnd },
          checkOutDate: { $gt: bCheckInStart },
        }).select('roomsBooked');

        const currentlyBooked = conflictingBookings.reduce(
          (sum, b) => sum + (Number(b.roomsBooked) || 1),
          0
        );
        const availableInventory = Math.max(0, totalInventory - currentlyBooked);

        if (requestedRooms > availableInventory) {
          console.warn(`⚠️ [Late Payment] Booking ${booking._id} paid after hold expired and room is taken. Initiating auto-refund.`);
          let autoRefundSuccess = false;
          let refundId = null;
          try {
            const refund = await razorpayInstance.payments.refund(razorpay_payment_id, {
              amount: payment.amount,
              notes: {
                reason: 'Auto-refund: Reservation hold expired and room was booked by another guest.',
                bookingId: booking._id.toString(),
              },
            });
            if (refund && refund.id) {
              autoRefundSuccess = true;
              refundId = refund.id;
              console.log(`✅ [Auto-Refund] Successfully refunded payment ${razorpay_payment_id} for booking ${booking._id}. Refund ID: ${refundId}`);
            }
          } catch (refundErr) {
            console.error('❌ [Auto-Refund] Gateway refund failed:', refundErr.message || refundErr);
          }

          booking.status = 'cancelled';
          booking.paymentStatus = autoRefundSuccess ? 'Refunded' : 'Paid';
          booking.razorpayPaymentId = razorpay_payment_id;
          booking.razorpayOrderId = razorpay_order_id;
          booking.specialNotes = autoRefundSuccess
            ? `Auto-refunded via Razorpay (${refundId}): Paid after 15-min hold expired; room was already taken by another guest.`
            : 'ACTION REQUIRED: Paid after 15-min hold expired; room taken. Auto-refund failed. Issue manual refund.';
          await booking.save();

          return res.status(409).json({
            success: false,
            autoRefunded: autoRefundSuccess,
            message: autoRefundSuccess
              ? 'Your payment was received, but the 15-minute reservation hold had expired and the room was booked by another guest. Your payment has been automatically refunded to your original payment method. Please select new dates.'
              : 'Your payment was received, but the 15-minute reservation hold had expired and the room was taken. Our team has been notified to immediately assist with a full refund.',
          });
        }

        // Inventory is still available! Resurrect the booking
        booking.specialNotes = 'Resurrected after late payment: inventory was still available.';
        await booking.save();
      }
    }

    // 4. Atomic conditional update to eliminate race condition with webhook
    // Only the single execution thread that successfully transitions paymentStatus from Pending -> Paid wins the right to send emails
    const updatedBooking = await Model.findOneAndUpdate(
      {
        _id: targetBookingId,
        paymentStatus: { $ne: 'Paid' },
      },
      {
        $set: {
          status: 'confirmed',
          paymentStatus: 'Paid',
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          ...(bookingType === 'hotel'
            ? {
              advancePaid: booking.totalAmount,
              balanceDue: 0,
              paymentMode: 'Online (Razorpay)',
            }
            : {}),
        },
      },
      { new: true }
    );

    // 5. Send confirmation emails ONLY if this thread won the atomic transition
    if (updatedBooking) {
      console.log(`✅ [verifyPayment] Atomic lock acquired for booking ${targetBookingId}. Dispatching confirmation emails.`);
      await dispatchConfirmationEmails(updatedBooking, bookingType);
    } else {
      console.log(`ℹ️ [verifyPayment] Booking ${targetBookingId} was already marked Paid by concurrent webhook. Idempotent email skip.`);
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

      // 3. Security cross-verification: Ensure paid currency is INR and amount matches expected database amount
      const currency = paymentEntity?.currency || orderEntity?.currency;
      if (currency && currency !== 'INR') {
        console.error(
          `🚨 [Razorpay Webhook] Security Alert: Currency mismatch detected! Received: ${currency}, Expected: INR`
        );
        return res.status(400).json({ status: 'error', message: 'Invalid currency detected' });
      }

      const expectedAmountInPaise = Math.round(Number(booking.totalAmount) * 100);
      if (paidAmountInPaise && paidAmountInPaise < expectedAmountInPaise) {
        console.error(
          `🚨 [Razorpay Webhook] Security Alert: Underpayment detected! Paid: ${paidAmountInPaise}, Expected: ${expectedAmountInPaise}`
        );
        return res.status(400).json({ status: 'error', message: 'Underpayment detected' });
      }

      // 3.1 Strict Zero Overbooking Policy on Late Webhook: Check if room was taken
      if (booking.status === 'cancelled') {
        if (actualType === 'hotel') {
          const Room = require('../models/Room');
          const roomData = await Room.findById(booking.room);
          const totalInventory = Number(roomData?.totalRooms) || 1;
          const requestedRooms = Math.max(1, parseInt(booking.roomsBooked || 1, 10));

          const checkInDateStr = new Date(booking.checkInDate).toISOString().split('T')[0];
          const checkOutDateStr = new Date(booking.checkOutDate).toISOString().split('T')[0];
          const bCheckInStart = new Date(`${checkInDateStr}T23:59:59.999Z`);
          const bCheckOutEnd = new Date(`${checkOutDateStr}T00:00:00.000Z`);

          const conflictingBookings = await Booking.find({
            _id: { $ne: booking._id },
            room: booking.room,
            status: { $ne: 'cancelled' },
            checkInDate: { $lt: bCheckOutEnd },
            checkOutDate: { $gt: bCheckInStart },
          }).select('roomsBooked');

          const currentlyBooked = conflictingBookings.reduce(
            (sum, b) => sum + (Number(b.roomsBooked) || 1),
            0
          );
          const availableInventory = Math.max(0, totalInventory - currentlyBooked);

          if (requestedRooms > availableInventory) {
            console.warn(`⚠️ [Razorpay Webhook] Booking ${booking._id} paid after hold expired and room is taken. Initiating auto-refund.`);
            let autoRefundSuccess = false;
            let refundId = null;
            if (paymentId) {
              try {
                const refund = await razorpayInstance.payments.refund(paymentId, {
                  amount: paidAmountInPaise,
                  notes: {
                    reason: 'Auto-refund: Reservation hold expired and room was booked by another guest.',
                    bookingId: booking._id.toString(),
                  },
                });
                if (refund && refund.id) {
                  autoRefundSuccess = true;
                  refundId = refund.id;
                  console.log(`✅ [Razorpay Webhook] Auto-refund successful for payment ${paymentId}. Refund ID: ${refundId}`);
                }
              } catch (refundErr) {
                console.error('❌ [Razorpay Webhook] Auto-refund failed:', refundErr.message || refundErr);
              }
            }

            booking.status = 'cancelled';
            booking.paymentStatus = autoRefundSuccess ? 'Refunded' : 'Paid';
            if (paymentId) booking.razorpayPaymentId = paymentId;
            if (orderId) booking.razorpayOrderId = orderId;
            booking.specialNotes = autoRefundSuccess
              ? `Auto-refunded via Razorpay (${refundId}): Paid after 15-min hold expired; room was already taken.`
              : 'ACTION REQUIRED: Paid after 15-min hold expired; room taken. Auto-refund failed. Issue manual refund.';
            await booking.save();

            return res.status(200).json({ status: 'ok', message: 'Late payment auto-refunded due to zero overbooking policy' });
          }

          // Inventory is still available! Resurrect
          booking.specialNotes = 'Resurrected after late payment: inventory was still available.';
          await booking.save();
        }
      }

      // 4. Atomic conditional update to eliminate race condition with browser verifyPayment
      const TargetModel = actualType === 'hotel' ? Booking : TravelBooking;
      const updatedBooking = await TargetModel.findOneAndUpdate(
        {
          _id: booking._id,
          paymentStatus: { $ne: 'Paid' },
        },
        {
          $set: {
            status: 'confirmed',
            paymentStatus: 'Paid',
            ...(orderId ? { razorpayOrderId: orderId } : {}),
            ...(paymentId ? { razorpayPaymentId: paymentId } : {}),
            razorpaySignature: signature,
            ...(actualType === 'hotel'
              ? {
                advancePaid: booking.totalAmount,
                balanceDue: 0,
                paymentMode: 'Online (Razorpay Webhook)',
              }
              : {}),
          },
        },
        { new: true }
      );

      // 5. Dispatch confirmation emails ONLY if this webhook won the atomic transition
      if (updatedBooking) {
        console.log(`✅ [Razorpay Webhook] Atomic lock acquired for booking ${booking._id}. Dispatching confirmation emails via webhook.`);
        await dispatchConfirmationEmails(updatedBooking, actualType);
      } else {
        console.log(`ℹ️ [Razorpay Webhook] Booking ${booking._id} was already finalized as Paid by browser verifier. Skipping duplicate email dispatch.`);
      }
    } else if (event === 'payment.failed') {
      const paymentEntity = req.body.payload?.payment?.entity;
      const orderId = paymentEntity?.order_id;
      const notes = paymentEntity?.notes || {};
      const bookingId = notes.bookingId;
      const bookingType = notes.bookingType;
      const failureReason = paymentEntity?.error_description || paymentEntity?.error_reason || 'Payment failed at gateway';

      console.warn(`⚠️ [Razorpay Webhook] Payment failed event received for order: ${orderId}. Reason: ${failureReason}`);
      if (bookingId && mongoose.Types.ObjectId.isValid(bookingId)) {
        if (bookingType === 'hotel') {
          await Booking.updateOne(
            { _id: bookingId, paymentStatus: 'Pending' },
            { $set: { paymentStatus: 'Failed' } }
          );
        } else if (bookingType === 'travel') {
          await TravelBooking.updateOne(
            { _id: bookingId, paymentStatus: 'Pending' },
            { $set: { paymentStatus: 'Failed' } }
          );
        } else {
          // Fallback if bookingType was omitted in notes: update only the matched collection
          const hotelUpdated = await Booking.updateOne(
            { _id: bookingId, paymentStatus: 'Pending' },
            { $set: { paymentStatus: 'Failed' } }
          );
          if (hotelUpdated.matchedCount === 0) {
            await TravelBooking.updateOne(
              { _id: bookingId, paymentStatus: 'Pending' },
              { $set: { paymentStatus: 'Failed' } }
            );
          }
        }
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
