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
// SECURITY & CORS MIDDLEWARE
// ========================

// 1. CORS: Must be the VERY FIRST middleware so every request (and preflight) receives CORS headers
const normalizeOrigin = (url) => (url || "").trim().toLowerCase().replace(/\/+$/, "");

const defaultOrigins = [
  "https://himalayanretreathotel.netlify.app",
  "https://hotlhimalayanretreat.netlify.app",
  "https://travelhimalayan.netlify.app",
  "https://adminhimalayan.netlify.app",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:5175",
  "http://127.0.0.1:5176",
];

const parseOrigins = (raw) => {
  if (!raw) return [];
  return raw
    .split(/[\s,]+/)
    .map(normalizeOrigin)
    .filter(Boolean)
    .flatMap((item) => {
      if (!item.startsWith("http://") && !item.startsWith("https://")) {
        return [`https://${item}`, `http://${item}`, item];
      }
      return [item];
    });
};

const configuredOrigins = new Set([
  ...defaultOrigins.map(normalizeOrigin),
  ...parseOrigins(process.env.ALLOWED_ORIGINS),
]);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server, curl, Postman or health checks with no origin
    if (!origin) {
      return callback(null, true);
    }
    const cleanOrigin = normalizeOrigin(origin);

    // Check exact configured matches
    if (configuredOrigins.has(cleanOrigin)) {
      return callback(null, true);
    }

    // Support any netlify subdomain for this project (e.g. deploy previews or netlify apps)
    try {
      const url = new URL(origin);
      if (
        url.hostname.endsWith(".netlify.app") ||
        url.hostname === "localhost" ||
        url.hostname === "127.0.0.1"
      ) {
        return callback(null, true);
      }
    } catch {
      // invalid URL
    }

    return callback(new Error(`CORS error: Origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// 2. Helmet: Secure HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// 3. Rate Limiter: Skips OPTIONS preflights
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  skip: (req) => req.method === "OPTIONS",
  message: {
    message: "Too many login attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/auth/login", loginLimiter);

// Body Parser (with 1MB limit and raw body capture for webhook signature verification)
app.use(
  express.json({
    limit: "1mb",
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);

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
    60 * 1000,
  ); // Runs every 1 minute to promptly release expired holds
});
