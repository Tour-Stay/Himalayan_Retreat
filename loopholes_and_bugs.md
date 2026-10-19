# ⚠️ Active System Loopholes, Bugs & Security Risks

> **Target System:** The Kasar Himalayan Heights & Himalayan Expeditions (Multi-App Monorepo)  
> **Audited Modules:** `Backend/controllers/paymentController.js`, `Backend/index.js`, `Backend/.env`  
> **Last Updated:** October 2026  
> **Filter Notice:** *All resolved vulnerabilities (Razorpay order price tampering, upstream booking creation price manipulation, date/input validation, missing webhook, payment ID replay, and HMAC timing side-channel) have been removed. This document tracks only active, open vulnerabilities and operational risks requiring attention.*

---

## 🟡 Loophole 1: Concurrency Race Condition (Duplicate Confirmation Emails)

- **Severity:** 🟡 **MEDIUM (Operational Inconsistency)**
- **Affected Files:**
  - `Backend/controllers/paymentController.js` (`verifyPayment` & `handleWebhook`)
- **Status:** ⚠️ **OPEN / ACTION REQUIRED**

### The Problem:
When a customer pays, two confirmation triggers run almost simultaneously:
1. The user's browser executes the Razorpay modal callback and calls `POST /api/payments/verify-payment`.
2. Razorpay's server sends a webhook (`payment.captured` or `order.paid`) to `POST /api/payments/webhook`.

Both handlers currently read the booking status non-atomically:
```javascript
const booking = await Model.findById(targetBookingId);
const wasAlreadyConfirmed = booking.paymentStatus === 'Paid';
...
await booking.save();
if (!wasAlreadyConfirmed) { sendConfirmationEmails(); }
```

If `/verify-payment` and `/webhook` execute within the same 50–100ms window, both can read `booking.paymentStatus === 'Pending'` before either saves. Consequently, both send confirmation emails to the customer and admin, resulting in duplicate emails.

### Recommended Fix:
Use MongoDB's atomic conditional update:
```javascript
const updatedBooking = await Model.findOneAndUpdate(
  { _id: targetBookingId, paymentStatus: { $ne: 'Paid' } },
  { $set: { status: 'confirmed', paymentStatus: 'Paid', ... } },
  { new: true }
);

if (updatedBooking) {
  // Only the single execution thread that successfully transitioned status sends emails
  await sendConfirmationEmails(updatedBooking);
}
```

---

## 🟡 Loophole 2: Overbooking / Double-Booking Risk on Auto-Cancelled Rooms

- **Severity:** 🟡 **MEDIUM (Inventory Edge Case)**
- **Affected Files:**
  - `Backend/index.js` (Background Cron Job, Line 80)
  - `Backend/controllers/paymentController.js` (`handleWebhook`)
- **Status:** ⚠️ **OPEN / ACTION REQUIRED**

### The Problem:
`Backend/index.js` runs a cron job every 5 minutes that auto-cancels bookings older than 15 minutes:
```javascript
await Booking.updateMany(
  { status: "pending", createdAt: { $lt: timeoutThreshold } },
  { $set: { status: "cancelled", specialNotes: "Auto-cancelled due to payment timeout (15 mins)" } }
);
```

### Exploit / Edge Scenario:
1. A guest starts booking a room at 12:00 PM.
2. Due to slow mobile network or bank 2FA OTP delay in remote hill regions, the guest takes 16 minutes to approve payment.
3. At 12:15 PM, the background cron marks the booking as `status: 'cancelled'`.
4. At 12:15:30 PM, another customer visits the site, sees the room is free for those dates, and reserves it.
5. At 12:16 PM, the first customer's bank captures the payment. Razorpay fires the webhook.
6. The webhook updates the first booking to `status: 'confirmed'` and `paymentStatus: 'Paid'`.
7. **Result:** Two different customers now hold confirmed bookings for the exact same room on the exact same dates (**Double Booking**).

### Recommended Fix:
In `handleWebhook`, if `booking.status === 'cancelled'`:
1. Re-run the room conflict query (`checkInDate` / `checkOutDate` overlap with active bookings).
2. If another booking already took the room, do **NOT** silently confirm. Mark the booking as `status: 'overbooked_refund_required'` and send an urgent alert email to the hotel admin to manually reassign or issue a refund.

---

## 🔵 Requirement 3: Production Live Credentials Required Before Launch

- **Severity:** 🔵 **OPERATIONAL (Pre-Launch Requirement)**
- **Affected File:**
  - `Backend/.env` (Lines 29–31)
- **Status:** ⚠️ **PENDING PRODUCTION DEPLOYMENT**

### The Requirement:
The backend currently contains Sandbox/Test keys (`rzp_test_...`). Real payments via Google Pay, PhonePe, Paytm, and cards will fail or only process in test mode until live production credentials are configured:
```env
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_live_secret_key
RAZORPAY_WEBHOOK_SECRET=your_configured_live_webhook_secret
```

---

## 📊 Summary of Active Issues

| # | Bug / Loophole | File(s) | Severity | Status |
|:---:|:---|:---|:---:|:---:|
| **1** | Webhook vs. Browser Concurrency Race (Duplicate Emails) | `paymentController.js` | 🟡 Medium | ⚠️ **Open** |
| **2** | Overbooking on Recovered Auto-Cancelled Bookings | `index.js`, `paymentController.js` | 🟡 Medium | ⚠️ **Open** |
| **3** | Test/Sandbox Keys in Environment | `Backend/.env` | 🔵 Operational | ⚠️ **Pending Launch** |
