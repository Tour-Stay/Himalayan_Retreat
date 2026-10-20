# ⚠️ Active System Loopholes, Bugs & Security Audit Report

> **Target System:** The Kasar Himalayan Heights & Himalayan Expeditions (Multi-App Monorepo)  
> **Audited Modules:** `Backend/controllers/paymentController.js`, `Backend/controllers/reviewController.js`, `Backend/controllers/hotelController.js`, `Backend/controllers/travelController.js`, `Backend/config/pricingEngine.js`, `Backend/index.js`, `Frontend/travel/src/components/FareCalculator.jsx`, `Frontend/shared/utils/syncBroadcaster.js`, `Frontend/shared/context/SiteSettingsContext.jsx`, `Frontend/shared/constants/siteConfig.js`, `Backend/.env`  
> **Last Updated:** October 2026  
> **Severity Levels:** 🔴 Critical | 🟠 High | 🟡 Medium | 🔵 Operational  

---

## 📊 Summary of Active Issues

| # | Bug / Loophole | Primary File(s) | Severity | Status |
|:---:|:---|:---|:---:|:---:|
| **1** | Reviewer PII Leakage & Unauthenticated Review Tampering (IDOR) | [reviewController.js](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Backend/controllers/reviewController.js#L12) | 🔴 Critical | ✅ **RESOLVED** |
| **2** | Payment Verification Bypass on Gateway Fetch Failure | [paymentController.js](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Backend/controllers/paymentController.js#L266) | 🔴 Critical | ✅ **RESOLVED** |
| **3** | Overbooking / Double-Booking on Auto-Cancelled Rooms (Late Payment) | [index.js](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Backend/index.js#L87), [paymentController.js](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Backend/controllers/paymentController.js#L257), [BookingForm.jsx](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Frontend/hotel/src/components/BookingForm.jsx#L40) | 🟠 High | ✅ **RESOLVED** |
| **4** | 1-Day Round Trip Pricing Discrepancy (Backend Undercharging vs Frontend) | [FareCalculator.jsx](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Frontend/travel/src/components/FareCalculator.jsx#L216), [pricingEngine.js](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Backend/config/pricingEngine.js#L118) | 🟠 High | ✅ **RESOLVED** |
| **5** | Payment Currency Manipulation & Missing Currency Verification | [paymentController.js](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Backend/controllers/paymentController.js#L268) | 🟠 High | ✅ **RESOLVED** |
| **6** | Premature Package Booking Confirmation Email Before Payment | [travelController.js](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Backend/controllers/travelController.js#L295) | 🟠 High | ✅ **RESOLVED** |
| **7** | Concurrency Race Condition (Duplicate Confirmation Emails) | [paymentController.js](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Backend/controllers/paymentController.js#L288) | 🟡 Medium | ✅ **RESOLVED** |
| **8** | Cross-Origin Real-Time Sync Failure (Port Sandboxing) | [syncBroadcaster.js](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Frontend/shared/utils/syncBroadcaster.js#L10), [SiteSettingsContext.jsx](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Frontend/shared/context/SiteSettingsContext.jsx#L433) | 🟡 Medium | ✅ **RESOLVED** |
| **9** | Failed Payment Webhook Blindly Updates Both Collections | [paymentController.js](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Backend/controllers/paymentController.js#L499) | 🟡 Medium | ✅ **RESOLVED** |
| **10** | Production Navigation Reverts to Localhost if Build Vars Missing | [siteConfig.js](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Frontend/shared/constants/siteConfig.js#L6), [AnnouncementBar.jsx](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Frontend/shared/layout/AnnouncementBar.jsx#L20) | 🟡 Medium | ⚠️ **Open** |
| **11** | Test/Sandbox Razorpay Credentials in Environment | [Backend/.env](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Backend/.env#L29) | 🔵 Operational | ⚠️ **Pending Launch** |

---

## 🔴 1. Reviewer PII Leakage & Unauthenticated Review Tampering (IDOR)

- **Severity:** 🔴 **CRITICAL (Data Exposure & Unauthorized Data Modification)**
- **Affected Files:**
  - [Backend/controllers/reviewController.js (lines 12–25)](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Backend/controllers/reviewController.js#L12-L25)
  - [Backend/controllers/reviewController.js (lines 98–147)](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Backend/controllers/reviewController.js#L98-L147)
  - [Backend/routes/travelRoutes.js (line 41)](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Backend/routes/travelRoutes.js#L41)
- **Status:** ✅ **RESOLVED**

### The Problem:
1. **PII Leakage in Public Query:** The public endpoint `GET /api/travel/reviews` performed `TravelReview.find(filter)` without projection, exposing the author's private email address over the network.
2. **Broken Authorization (IDOR):** The update endpoint `PUT /api/travel/reviews/:id` was unauthenticated and validated ownership solely via plain email match.

### Implemented Fix:
1. **Excluded Email from Public Response:** Added `.select('-email')` to `getAllReviews` so private emails are never transmitted across the network.
2. **Protected Route:** Added `authMiddleware` to `PUT /api/travel/reviews/:id` in `travelRoutes.js` so only authenticated admins can update reviews.
3. **Re-Moderation Rule:** Configured `updateReview` to automatically reset `isApproved = false` upon editing, ensuring any modified review is re-vetted before going live.

---

## 🔴 2. Payment Verification Bypass on Gateway Fetch Failure

- **Severity:** 🔴 **CRITICAL (Financial / Booking Integrity)**
- **Affected Files:**
  - [Backend/controllers/paymentController.js (lines 266–308)](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Backend/controllers/paymentController.js#L266-L308)
- **Status:** ✅ **RESOLVED**

### The Problem:
In `verifyPayment`, when `payments.fetch` threw an error (gateway network timeout, connection drop, rate limit), the catch block caught the error, logged a warning, and silently allowed execution to proceed, confirming bookings without establishing that funds were captured.

### Implemented Fix:
1. **Fail-Closed Architecture:** Replaced the silent bypass with a strict fail-closed handler. If the payment gateway API fails to respond or errors, the server returns HTTP 502 without confirming the booking, protecting against uncaptured bookings.
2. **Explicit Captured Verification:** Added strict checks requiring `payment.status === 'captured'`, matching order ID, and exact amount validation before triggering the atomic update.

---

## 🟠 3. Overbooking / Double-Booking on Auto-Cancelled Rooms (Late Payment)

- **Severity:** 🟠 **HIGH (Hospitality Operations / Inventory Conflict)**
- **Affected Files:**
  - [Backend/index.js (lines 87–117)](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Backend/index.js#L87-L117)
  - [Backend/controllers/paymentController.js (lines 85–99, 270–320, 520–575)](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Backend/controllers/paymentController.js)
  - [Frontend/hotel/src/components/BookingForm.jsx (lines 40–70, 210–320, 550–615)](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Frontend/hotel/src/components/BookingForm.jsx)
  - [Frontend/shared/hooks/useRazorpay.js (lines 45–85)](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Frontend/shared/hooks/useRazorpay.js)
- **Status:** ✅ **RESOLVED (Strict Zero-Overbooking & 15-Minute Expiry Architecture)**

### The Problem:
1. `Backend/index.js` ran a cron job every 5 minutes auto-cancelling pending bookings older than 15 minutes.
2. In `hotelController.js`, room availability checks filter out cancelled bookings (`status: { $ne: 'cancelled' }`). Once cancelled, that room was unlocked for other guests.
3. If Guest 1 experienced a delay (e.g., bank OTP delays or tab left open) and completed payment after the 15-minute hold, the backend previously blindly marked the booking as `confirmed`, risking double bookings if another guest had reserved the suite in the interim.
4. **Client Requirement:** Strict Zero-Overbooking policy. If the reservation window expires, the room is released. If money clears late and the room was taken, money must be automatically refunded via Razorpay and the customer prompted to select new dates.

### Implemented Fix:
1. **1-Minute Precision Auto-Cancellation Cron:**
   - In [Backend/index.js](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Backend/index.js), updated cron frequency from `*/5 * * * *` to `* * * * *` (every 60s) so holds expire precisely within 1 minute of the 15-minute mark.
2. **Gateway Order Rejection on Expired Hold:**
   - In [Backend/controllers/paymentController.js](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Backend/controllers/paymentController.js) (`createOrder`), checks if `bookingAgeMs > 15 * 60 * 1000` or `booking.status === 'cancelled'`. Rejects order generation with HTTP 400 and returns authoritative `holdExpiresAt`.
3. **Strict Real-Time Inventory Audit & Automatic Gateway Refund:**
   - In both `verifyPayment` and `handleWebhook`, if a booking arrives with `status === 'cancelled'`:
     - Checks live inventory against non-cancelled bookings for those exact dates.
     - **If inventory is still available:** Resurrects the booking to `confirmed` and `Paid`.
     - **If room was taken by another guest:** Instantly issues a programmatic refund via `razorpayInstance.payments.refund(paymentId)`, sets `booking.paymentStatus = 'Refunded'`, and responds with HTTP 409 Conflict. Zero chance of overbooking.
4. **Frontend 15-Minute Countdown Timer & Expiry Lockout:**
   - In [Frontend/hotel/src/components/BookingForm.jsx](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Frontend/hotel/src/components/BookingForm.jsx):
     - Added real-time countdown badge (`⏳ Hold expires in: MM:SS`).
     - When timer reaches `00:00`, retry button is permanently locked, clear visual warning is shown (`The 15-minute temporary hold has expired`), and guest is guided to re-select dates.
   - In [Frontend/shared/hooks/useRazorpay.js](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Frontend/shared/hooks/useRazorpay.js):
     - Added `onOrderCreated` callback to pass server `holdExpiresAt` and `modal.ondismiss` to immediately activate the pending countdown if the user closes the modal.

---

## 🟠 4. 1-Day Round Trip Pricing Discrepancy (Backend Undercharging vs Frontend)

- **Severity:** 🟠 **HIGH (Direct Revenue Loss)**
- **Affected Files:**
  - [Frontend/travel/src/components/FareCalculator.jsx (line 402)](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Frontend/travel/src/components/FareCalculator.jsx#L402)
  - [Backend/config/pricingEngine.js (lines 118–122)](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Backend/config/pricingEngine.js#L118-L122)
  - [Backend/controllers/travelController.js (lines 210–250)](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Backend/controllers/travelController.js#L210-L250)
  - [Backend/models/TravelBooking.js (lines 26–30)](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Backend/models/TravelBooking.js#L26-L30)
- **Status:** ✅ **RESOLVED**

### The Problem:
1. In `FareCalculator.jsx`, same-day round trips (e.g. Almora to Kainchi Dham round-trip: `days = 1`, `tripType = 'round-trip'`) were displayed with full round-trip pricing.
2. The payload omitted `tripType`, and the backend deduced round-trips via `days > 1 || circuit.includes('round')`, misclassifying 1-day round trips as one-way drops and undercharging customers by ~45%.

### Implemented Fix:
1. **Schema Update:** Added `tripType` (`'one-way' | 'round-trip'`) to [TravelBooking.js](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Backend/models/TravelBooking.js).
2. **Frontend Payload:** [FareCalculator.jsx](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Frontend/travel/src/components/FareCalculator.jsx) transmits `tripType` explicitly in the booking payload.
3. **Backend Calculation:** [pricingEngine.js](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Backend/config/pricingEngine.js) and [travelController.js](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Backend/controllers/travelController.js) evaluate `bookingDetails.tripType === 'round-trip'` to calculate the accurate 150 km minimum billable distance and round-trip driver batta.
4. **Admin Manager:** [TravelBookingManager.jsx](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Frontend/admin/src/components/TravelBookingManager.jsx) displays a `Round-Trip` / `One-Way` badge on trip rows.

---

## 🟠 5. Payment Currency Manipulation & Missing Currency Verification

- **Severity:** 🟠 **HIGH (Payment Integrity & Gateway Ambiguity)**
- **Affected Files:**
  - [Backend/controllers/paymentController.js (lines 114, 268, 304, 560)](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Backend/controllers/paymentController.js)
- **Status:** ✅ **RESOLVED**

### The Problem:
1. `createOrder` explicitly set currency to `'INR'`, but in `verifyPayment`, the code only verified `razorpayOrder.amount !== expectedAmountInPaise`. It never checked whether `razorpayOrder.currency === 'INR'` or `payment.currency === 'INR'`.
2. Similarly, `handleWebhook` only checked `paidAmountInPaise < expectedAmountInPaise` without checking the currency.
3. If Razorpay was configured with international payments enabled, a transaction in a foreign currency (e.g., JPY) could match numeric digits while holding vastly lower economic value.

### Implemented Fix:
1. **Order Creation:** Hardcoded `currency: 'INR'` unconditionally in `createOrder`.
2. **Order & Payment Verification:** In `verifyPayment`, added strict checks:
   - `if (razorpayOrder.currency !== 'INR') return res.status(400)`
   - `if (payment.currency && payment.currency !== 'INR') return res.status(400)`
3. **Webhook Verification:** In `handleWebhook`, added strict currency verification:
   - `if (currency && currency !== 'INR') return res.status(400)`

---

## 🟠 6. Premature Package Booking Confirmation Email Sent Before Payment

- **Severity:** 🟠 **HIGH (Operational Inconsistency / Customer Expectation)**
- **Affected Files:**
  - [Backend/controllers/travelController.js (lines 280–305)](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Backend/controllers/travelController.js#L280-L305)
  - [Backend/controllers/paymentController.js (lines 24–40)](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Backend/controllers/paymentController.js#L24-L40)
- **Status:** ✅ **RESOLVED**

### The Problem:
`travelController.js` previously dispatched `sendTravelBookingEmail` immediately when `TravelBooking.create` was called with `paymentStatus: 'Pending'`, before the customer ever entered the Razorpay checkout. If the user cancelled or the payment failed, they still held an official confirmation email.

### Implemented Fix:
Removed the premature email dispatch block and unused import from [travelController.js](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Backend/controllers/travelController.js). All tour package confirmation emails are now strictly dispatched by `dispatchConfirmationEmails` in [paymentController.js](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Backend/controllers/paymentController.js#L24-L40) only after payment has been verified and captured.

---

## 🟡 7. Concurrency Race Condition (Duplicate Confirmation Emails)

- **Severity:** 🟡 **MEDIUM (Operational Inconsistency / Duplicate Notifications)**
- **Affected Files:**
  - [Backend/controllers/paymentController.js (lines 257–280)](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Backend/controllers/paymentController.js#L257-L280)
  - [Backend/controllers/paymentController.js (lines 413–467)](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Backend/controllers/paymentController.js#L413-L467)
- **Status:** ✅ **RESOLVED** (Implemented atomic `findOneAndUpdate` with `{ paymentStatus: { $ne: 'Paid' } }` in both `verifyPayment` and `handleWebhook`)

### The Problem:
When a customer pays, two confirmation triggers run almost simultaneously:
1. The user's browser executes the Razorpay modal callback and calls `POST /api/payments/verify`.
2. Razorpay's server sends a webhook (`payment.captured` or `order.paid`) to `POST /api/payments/webhook`.

Both handlers currently read the booking status non-atomically:
```javascript
// Thread 1 (Browser Verifier)              // Thread 2 (Webhook)
const booking = await Model.findById(id);    const booking = await Model.findById(id);
// both read paymentStatus === 'Pending'
await booking.save();                        await booking.save();
sendEmails();                                sendEmails();
```
Because neither step is atomic, both observe `paymentStatus !== 'Paid'` before either has saved, resulting in duplicate emails to both customer and admin.

### Way to Fix:
Use MongoDB's atomic conditional update (`findOneAndUpdate`):
```javascript
const Model = actualType === 'hotel' ? Booking : TravelBooking;

const updatedBooking = await Model.findOneAndUpdate(
  {
    _id: booking._id,
    paymentStatus: { $ne: 'Paid' }, // Atomic condition: only one thread can match
  },
  {
    $set: {
      status: 'confirmed',
      paymentStatus: 'Paid',
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      razorpaySignature: signature,
    },
  },
  { new: true }
);

if (updatedBooking) {
  // Only the single execution thread that won the atomic transition sends emails
  await dispatchConfirmationEmails(updatedBooking, actualType);
}
```

---

## 🟡 8. Cross-Origin Real-Time Sync Failure (Port Sandboxing)

- **Severity:** 🟡 **MEDIUM (Stale UI State in Browser)**
- **Affected Files:**
  - [Frontend/shared/utils/syncBroadcaster.js (lines 47–98)](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Frontend/shared/utils/syncBroadcaster.js#L47-L98)
  - [Frontend/shared/context/SiteSettingsContext.jsx (lines 433–465)](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Frontend/shared/context/SiteSettingsContext.jsx#L433-L465)
  - [Frontend/hotel/src/pages/HotelHome.jsx (lines 62–65)](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Frontend/hotel/src/pages/HotelHome.jsx#L62-L65)
  - [Frontend/hotel/src/pages/AllRooms.jsx (lines 28–32)](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Frontend/hotel/src/pages/AllRooms.jsx#L28-L32)
- **Status:** ✅ **RESOLVED**

### The Problem:
1. The portals run on different ports (`5173` Landing, `5174` Hotel, `5175` Travel, `5176` Admin).
2. Under the browser's **Same-Origin Policy**, different ports constitute completely different origins.
3. Both `BroadcastChannel` and `window.localStorage` (and the `'storage'` event) are sandboxed to the current origin. Broadcasts from Admin (`:5176`) **never reach** Hotel (`:5174`) or Travel (`:5175`).
4. Foreground polling was previously disabled under the assumption that `BroadcastChannel` handles cross-app sync, causing open customer portals to display stale prices.

### Implemented Fix:
1. **Upgraded `subscribeToUpdates` Utility:** Added a lightweight, visibility-aware background polling fallback (`pollIntervalMs`) to [syncBroadcaster.js](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Frontend/shared/utils/syncBroadcaster.js). Polling only executes when the browser tab is actively visible (`document.visibilityState === 'visible'`), conserving CPU and bandwidth.
2. **Context Auto-Refresh:** Configured [SiteSettingsContext.jsx](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Frontend/shared/context/SiteSettingsContext.jsx) to poll every 60 seconds and revalidate whenever a user returns to the tab after >60s of inactivity.
3. **Room Inventory & Pricing Sync:** Configured [HotelHome.jsx](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Frontend/hotel/src/pages/HotelHome.jsx) and [AllRooms.jsx](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Frontend/hotel/src/pages/AllRooms.jsx) with 60-second polling to ensure room rates and availability sync across origins.

---

## 🟡 9. Failed Payment Webhook Blindly Updates Both Collections

- **Severity:** 🟡 **MEDIUM / ARCHITECTURAL**
- **Affected Files:**
  - [Backend/controllers/paymentController.js (lines 499–532)](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Backend/controllers/paymentController.js#L499-L532)
- **Status:** ✅ **RESOLVED** (Updated webhook to inspect `notes.bookingType` and target the specific model with a safe fallback)

### The Problem:
When `payment.failed` event is received by the webhook:
```javascript
const bookingId = notes.bookingId;
if (bookingId && mongoose.Types.ObjectId.isValid(bookingId)) {
  await Booking.updateOne({ _id: bookingId, paymentStatus: 'Pending' }, { $set: { paymentStatus: 'Failed' } });
  await TravelBooking.updateOne({ _id: bookingId, paymentStatus: 'Pending' }, { $set: { paymentStatus: 'Failed' } });
}
```
`notes.bookingType` was saved during `createOrder`, but the `payment.failed` handler ignored it and queried both collections.

### Implemented Fix:
Inspect `notes.bookingType` to target only the appropriate collection, with fallback:
```javascript
if (bookingType === 'hotel') {
  await Booking.updateOne({ _id: bookingId, paymentStatus: 'Pending' }, { $set: { paymentStatus: 'Failed' } });
} else if (bookingType === 'travel') {
  await TravelBooking.updateOne({ _id: bookingId, paymentStatus: 'Pending' }, { $set: { paymentStatus: 'Failed' } });
} else {
  const hotelUpdated = await Booking.updateOne({ _id: bookingId, paymentStatus: 'Pending' }, { $set: { paymentStatus: 'Failed' } });
  if (hotelUpdated.matchedCount === 0) {
    await TravelBooking.updateOne({ _id: bookingId, paymentStatus: 'Pending' }, { $set: { paymentStatus: 'Failed' } });
  }
}
```

---

## 🟡 10. Production Navigation Reverts to Localhost if Build Vars Missing

- **Severity:** 🟡 **MEDIUM / OPERATIONAL (Build-Time Fragility)**
- **Affected Files:**
  - [Frontend/shared/constants/siteConfig.js (lines 6–11)](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Frontend/shared/constants/siteConfig.js#L6-L11)
  - [Frontend/shared/layout/AnnouncementBar.jsx (lines 20–35)](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Frontend/shared/layout/AnnouncementBar.jsx#L20-L35)
- **Status:** ⚠️ **OPEN / ACTION REQUIRED**

### The Problem:
`siteConfig.js` sets default fallbacks:
```javascript
export const APP_URLS = {
  landing: import.meta.env.VITE_LANDING_URL || 'http://localhost:5173',
  hotel: import.meta.env.VITE_HOTEL_URL || 'http://localhost:5174',
  travel: import.meta.env.VITE_TRAVEL_URL || 'http://localhost:5175',
  admin: import.meta.env.VITE_ADMIN_URL || 'http://localhost:5176',
};
```
Vite inlines `import.meta.env` at **build time** (`npm run build`). If production builds are triggered in CI/CD without these environment variables defined, the compiled bundle permanently embeds `localhost:5173...`. When live visitors click cross-portal links or announcement banners, the browser routes them to `localhost`, failing with connection errors.

### Way to Fix:
1. Add build-time assertions in `vite.config.js` to ensure `VITE_*_URL` variables are present when building for production.
2. In production deployments, configure root or path-based reverse proxy routing (`/hotel`, `/travel`, `/admin`) or explicit subdomains so links resolve relative to `window.location.origin` if environment variables are missing.

---

## 🔵 11. Test/Sandbox Razorpay Credentials in Environment

- **Severity:** 🔵 **OPERATIONAL (Pre-Launch Requirement)**
- **Affected File:**
  - [Backend/.env (lines 29–31)](file:///c:/Users/Lalit%20Nandan/Desktop/Dear/Backend/.env#L29-L31)
- **Status:** ⚠️ **PENDING PRODUCTION DEPLOYMENT**

### The Requirement:
The backend currently contains Sandbox/Test keys (`rzp_test_...`). Real payments via Google Pay, PhonePe, Paytm, and credit/debit cards will fail or only process in test mode until live production credentials and live webhook endpoints are configured:
```env
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_live_secret_key
RAZORPAY_WEBHOOK_SECRET=your_configured_live_webhook_secret
```
Additionally, the live webhook URL (`https://your-api-domain.com/api/payments/webhook`) must be registered in the Razorpay Dashboard subscribed to `payment.captured`, `order.paid`, and `payment.failed`.
