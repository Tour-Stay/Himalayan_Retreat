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
    from: `"The Kasar Himalayan Heights" <${process.env.SENDER_EMAIL}>`,
    to: booking.guestDetails.email,
    subject: '🏨 Booking Confirmed — The Kasar Himalayan Heights',
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #fafafa; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 30px; text-align: center;">
          <h1 style="color: #e0c097; margin: 0; font-size: 24px;">The Kasar Himalayan Heights</h1>
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
          <p style="color: #555;">If you have any questions, feel free to reach out via WhatsApp or call us at <strong>+91 96906 21247</strong>.</p>
          <p style="color: #888; font-size: 12px; margin-top: 30px;">This is an automated confirmation. Please do not reply to this email.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// ========================
// ADMIN ALERT: NEW HOTEL BOOKING
// ========================
const sendAdminNewHotelBookingEmail = async (booking, room) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'concierge@kasarhimalayanheights.com';
  
  const mailOptions = {
    from: `"Kasar Booking System" <${process.env.SENDER_EMAIL}>`,
    to: adminEmail,
    subject: `🔔 NEW BOOKING PAID: ${room.name} - ${booking.guestDetails.name}`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #fff; border: 1px solid #ddd; border-radius: 8px;">
        <div style="background: #073125; padding: 20px; color: #fff; text-align: center; border-radius: 8px 8px 0 0;">
          <h2 style="margin: 0;">New Confirmed Booking</h2>
          <p style="margin: 5px 0 0; color: #C9F24D;">Action Required: Please check the Admin Portal</p>
        </div>
        <div style="padding: 20px;">
          <p><strong>Guest Name:</strong> ${booking.guestDetails.name}</p>
          <p><strong>Guest Phone:</strong> ${booking.guestDetails.phone}</p>
          <p><strong>Guest Email:</strong> ${booking.guestDetails.email}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;">
          <p><strong>Room:</strong> ${room.name}</p>
          <p><strong>Check-in:</strong> ${new Date(booking.checkInDate).toDateString()}</p>
          <p><strong>Check-out:</strong> ${new Date(booking.checkOutDate).toDateString()}</p>
          <p><strong>Guests:</strong> ${booking.guests || 'N/A'}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;">
          <p><strong>Total Amount:</strong> ₹${booking.totalAmount}</p>
          <p><strong>Advance Paid:</strong> ₹${booking.advancePaid || booking.totalAmount}</p>
          <p><strong>Razorpay Order ID:</strong> ${booking.razorpayOrderId || 'N/A'}</p>
          <p><strong>Razorpay Payment ID:</strong> ${booking.razorpayPaymentId || 'N/A'}</p>
          ${booking.specialRequest ? `<p><strong>Special Request:</strong> ${booking.specialRequest}</p>` : ''}
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
    from: `"Himalayan Travel" <${process.env.SENDER_EMAIL}>`,
    to: booking.guestDetails.email,
    subject: '🌄 Trip Booked — Himalayan Travel',
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #fafafa; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #0f3443, #34e89e); padding: 30px; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 24px;">Himalayan Travel</h1>
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
          <p style="color: #555;">We'll be in touch with more details closer to your travel date. If you need immediate assistance, call or WhatsApp our Admin desk at <strong>+91 96906 21247</strong>.</p>
          <p style="color: #888; font-size: 12px; margin-top: 30px;">This is an automated confirmation. Please do not reply to this email.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// ========================
// ADMIN ALERT: NEW TRAVEL BOOKING
// ========================
const sendAdminNewTravelBookingEmail = async (booking, tourPackage) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'concierge@kasarhimalayanheights.com';
  
  const mailOptions = {
    from: `"Kasar Booking System" <${process.env.SENDER_EMAIL}>`,
    to: adminEmail,
    subject: `🚐 NEW TRAVEL BOOKING PAID: ${booking.guestDetails.name}`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #fff; border: 1px solid #ddd; border-radius: 8px;">
        <div style="background: #0f3443; padding: 20px; color: #fff; text-align: center; border-radius: 8px 8px 0 0;">
          <h2 style="margin: 0;">New Travel Booking</h2>
          <p style="margin: 5px 0 0; color: #34e89e;">Action Required: Please check the Admin Portal</p>
        </div>
        <div style="padding: 20px;">
          <p><strong>Guest Name:</strong> ${booking.guestDetails.name}</p>
          <p><strong>Guest Phone:</strong> ${booking.guestDetails.phone}</p>
          <p><strong>Guest Email:</strong> ${booking.guestDetails.email}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;">
          <p><strong>Package/Destination:</strong> ${tourPackage?.title || tourPackage?.destination || booking.circuit || 'Custom Trip'}</p>
          <p><strong>Travel Date:</strong> ${new Date(booking.travelDate).toDateString()}</p>
          <p><strong>Travelers:</strong> ${booking.travelers}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;">
          <p><strong>Total Amount:</strong> ₹${booking.totalAmount}</p>
          <p><strong>Razorpay Order ID:</strong> ${booking.razorpayOrderId || 'N/A'}</p>
          <p><strong>Razorpay Payment ID:</strong> ${booking.razorpayPaymentId || 'N/A'}</p>
          ${booking.notes ? `<p><strong>Notes:</strong> ${booking.notes}</p>` : ''}
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// ========================
// REVIEW THANK YOU EMAIL
// ========================
const sendReviewThankYouEmail = async (review) => {
  const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
  const photoCount = review.photos ? review.photos.length : 0;

  const mailOptions = {
    from: `"The Kasar Himalayan Heights" <${process.env.SENDER_EMAIL}>`,
    to: review.email,
    subject: '🏔️ Thank You for Your Travel Story — The Kasar Himalayan Heights',
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #fafafa; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #1a1a2e, #2d1b69); padding: 40px 30px; text-align: center;">
          <div style="font-size: 48px; margin-bottom: 8px;">🏔️</div>
          <h1 style="color: #e0c097; margin: 0; font-size: 24px; letter-spacing: 1px;">The Kasar Himalayan Heights</h1>
          <p style="color: #b8a88a; margin: 8px 0 0; font-size: 13px; letter-spacing: 2px; text-transform: uppercase;">Thank You for Your Story</p>
        </div>
        <div style="padding: 35px 30px;">
          <h2 style="color: #1a1a2e; margin-top: 0; font-size: 20px;">Namaste ${review.name}! 🙏</h2>
          <p style="color: #555; line-height: 1.7; font-size: 14px;">
            Thank you for sharing your mountain travel experience with us. Your review means the world to our team and helps fellow travelers discover the magic of the Himalayas.
          </p>

          <div style="background: linear-gradient(135deg, #f8f6f0, #fff); border: 1px solid #e8e0d0; border-radius: 12px; padding: 24px; margin: 25px 0;">
            <div style="text-align: center; margin-bottom: 12px;">
              <span style="font-size: 22px; color: #e0c097; letter-spacing: 3px;">${stars}</span>
            </div>
            <p style="color: #666; font-style: italic; font-size: 14px; line-height: 1.6; margin: 0; text-align: center;">
              "${review.review.length > 200 ? review.review.substring(0, 200) + '...' : review.review}"
            </p>
            ${review.tripType ? `<p style="text-align: center; margin: 12px 0 0; color: #b8a88a; font-size: 12px; letter-spacing: 1px; text-transform: uppercase;">${review.location ? review.location + ' • ' : ''}${review.tripType}</p>` : ''}
          </div>

          ${photoCount > 0 ? `
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px; text-align: center;">
            <span style="color: #166534; font-size: 13px; font-weight: 600;">📸 ${photoCount} travel photo${photoCount > 1 ? 's' : ''} uploaded successfully</span>
          </div>
          ` : ''}

          <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 14px 16px; margin-bottom: 20px;">
            <p style="color: #92400e; font-size: 12px; margin: 0; line-height: 1.5;">
              <strong>💡 Good to know:</strong> You can edit your review anytime using your email address for verification. Your email is never displayed publicly.
            </p>
          </div>

          <p style="color: #555; font-size: 14px; line-height: 1.6;">
            Your story is now live on our travel page, inspiring the next generation of mountain explorers. We hope to welcome you back to the Himalayas soon!
          </p>

          <div style="text-align: center; margin: 30px 0 10px;">
            <span style="color: #b8a88a; font-size: 22px;">❄️ 🏔️ 🌲</span>
          </div>

          <p style="color: #aaa; font-size: 11px; text-align: center; margin-top: 25px; padding-top: 20px; border-top: 1px solid #eee;">
            The Kasar Himalayan Heights — Kasar Devi, 6,942 FT • Uttarakhand, India<br/>
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { 
  sendHotelBookingEmail, 
  sendTravelBookingEmail, 
  sendAdminNewTravelBookingEmail,
  sendReviewThankYouEmail,
  sendAdminNewHotelBookingEmail
};
