const nodemailer = require('nodemailer');

// Create reusable transporter using Brevo SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ========================
// HOTEL BOOKING CONFIRMATION
// ========================
const sendHotelBookingEmail = async (booking, room) => {
  const mailOptions = {
    from: `"Devbhoomi Retreat" <${process.env.SENDER_EMAIL}>`,
    to: booking.guestDetails.email,
    subject: '🏨 Booking Confirmed — Devbhoomi Retreat',
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #fafafa; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 30px; text-align: center;">
          <h1 style="color: #e0c097; margin: 0; font-size: 24px;">Devbhoomi Retreat</h1>
          <p style="color: #ccc; margin: 5px 0 0;">Your Mountain Escape Awaits</p>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #1a1a2e; margin-top: 0;">Hello ${booking.guestDetails.name},</h2>
          <p style="color: #555;">Your booking has been confirmed! Here are your details:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; color: #888;">Room</td>
              <td style="padding: 10px 0; font-weight: bold; text-align: right;">${room.name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; color: #888;">Check-in</td>
              <td style="padding: 10px 0; font-weight: bold; text-align: right;">${new Date(booking.checkInDate).toDateString()}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; color: #888;">Check-out</td>
              <td style="padding: 10px 0; font-weight: bold; text-align: right;">${new Date(booking.checkOutDate).toDateString()}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #888;">Total Amount</td>
              <td style="padding: 10px 0; font-weight: bold; text-align: right; color: #2d6a4f; font-size: 18px;">₹${booking.totalAmount}</td>
            </tr>
          </table>
          <p style="color: #555;">If you have any questions, feel free to reach out via WhatsApp or call us.</p>
          <p style="color: #888; font-size: 12px; margin-top: 30px;">This is an automated confirmation. Please do not reply to this email.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// ========================
// TRAVEL BOOKING CONFIRMATION
// ========================
const sendTravelBookingEmail = async (booking, tourPackage) => {
  const mailOptions = {
    from: `"Devbhoomi Travel" <${process.env.SENDER_EMAIL}>`,
    to: booking.guestDetails.email,
    subject: '🌄 Trip Booked — Devbhoomi Travel',
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #fafafa; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #0f3443, #34e89e); padding: 30px; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 24px;">Devbhoomi Travel</h1>
          <p style="color: #ddd; margin: 5px 0 0;">Adventure Starts Here</p>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #0f3443; margin-top: 0;">Hello ${booking.guestDetails.name},</h2>
          <p style="color: #555;">Your trip has been booked! Here are your details:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; color: #888;">Package</td>
              <td style="padding: 10px 0; font-weight: bold; text-align: right;">${tourPackage.title}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; color: #888;">Destination</td>
              <td style="padding: 10px 0; font-weight: bold; text-align: right;">${tourPackage.destination}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; color: #888;">Travel Date</td>
              <td style="padding: 10px 0; font-weight: bold; text-align: right;">${new Date(booking.travelDate).toDateString()}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; color: #888;">Travelers</td>
              <td style="padding: 10px 0; font-weight: bold; text-align: right;">${booking.travelers}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #888;">Total Amount</td>
              <td style="padding: 10px 0; font-weight: bold; text-align: right; color: #2d6a4f; font-size: 18px;">₹${booking.totalAmount}</td>
            </tr>
          </table>
          <p style="color: #555;">We'll be in touch with more details closer to your travel date.</p>
          <p style="color: #888; font-size: 12px; margin-top: 30px;">This is an automated confirmation. Please do not reply to this email.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendHotelBookingEmail, sendTravelBookingEmail };
