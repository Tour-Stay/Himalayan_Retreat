const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("mongo-sanitize-express5");
const connectDB = require("./config/db");
require("dotenv").config();

// Connect to Database
connectDB();

const app = express();

// ========================
// SECURITY MIDDLEWARE
// ========================

// Helmet: Sets secure HTTP headers (prevents XSS, clickjacking, etc.)
app.use(helmet());

// Rate Limiter: Prevents brute-force attacks on login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 login attempts per 15 minutes per IP
  message: {
    message: "Too many login attempts. Please try again after 15 minutes.",
  },
});
app.use("/api/auth/login", loginLimiter);

// CORS: Explicitly whitelist all 4 frontend monorepo ports (5173, 5174, 5175, 5176)
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5176",
    ];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

// Body Parser (with 1MB limit to prevent DoS attacks)
app.use(express.json({ limit: "1mb" }));

// NoSQL Injection Sanitization: Strips prohibited MongoDB operators ($ and .) from request inputs
app.use(mongoSanitize());

// Basic Route
app.get("/", (req, res) => {
  res.send("Backend API is running!");
});

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/hotel", require("./routes/hotelRoutes"));
app.use("/api/travel", require("./routes/travelRoutes"));
app.use("/api/settings", require("./routes/settingsRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  // Background Job: Auto-cancel pending bookings if payment is not received within 15 minutes
  const Booking = require("./models/Booking");
  const TravelBooking = require("./models/TravelBooking");

  setInterval(
    async () => {
      try {
        const timeoutThreshold = new Date(Date.now() - 15 * 60 * 1000); // 15 mins ago

        const hotelResult = await Booking.updateMany(
          { status: "pending", createdAt: { $lt: timeoutThreshold } },
          {
            $set: {
              status: "cancelled",
              specialNotes: "Auto-cancelled due to payment timeout (15 mins)",
            },
          },
        );

        const travelResult = await TravelBooking.updateMany(
          { status: "pending", createdAt: { $lt: timeoutThreshold } },
          { $set: { status: "cancelled" } },
        );

        if (hotelResult.modifiedCount > 0 || travelResult.modifiedCount > 0) {
          console.log(
            `[Cron] Auto-cancelled ${hotelResult.modifiedCount} hotel and ${travelResult.modifiedCount} travel abandoned bookings.`,
          );
        }
      } catch (err) {
        console.error("[Cron] Error in auto-cancellation background job:", err);
      }
    },
    5 * 60 * 1000,
  ); // Runs every 5 minutes
});
