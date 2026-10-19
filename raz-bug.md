# 💳 Razorpay Payment Gateway — Security & Vulnerability Audit Report

> **Target System:** The Kasar Himalayan Heights & Himalayan Expeditions (Multi-App Monorepo)  
> **Audited Modules:** `Backend/controllers/paymentController.js`, `Backend/config/razorpay.js`, `Frontend/shared/hooks/useRazorpay.js`, `Backend/models/Booking.js`, `Backend/models/TravelBooking.js`  
> **Date:** October 2026  
> **Severity Levels:** 🔴 Critical | 🟠 High | 🟡 Medium | 🔵 Operational

---

## 📋 Executive Summary

The cryptographic core of the current Razorpay integration is correctly using HMAC-SHA256 signature verification, and private secrets (`RAZORPAY_KEY_SECRET`) are properly safeguarded on the server side without being leaked to the browser.

However, a **critical financial vulnerability (Client-Side Price Manipulation)** and a **major operational risk (Dropped Payments without Webhooks)** were identified during code inspection. If deployed to production in its current state, malicious users could confirm high-value hotel suites or multi-day cab tours for ₹1, and legitimate users whose internet drops after bank OTP entry will have their money deducted without their booking being confirmed.

---

## 🔴 Issue 1: Client-Side Price Tampering (Underpayment Exploit)

- **Severity:** 🔴 **CRITICAL (Direct Financial Loss)**
- **Affected Files:**
  - `Backend/controllers/paymentController.js` (lines 14–37)
  - `Frontend/shared/hooks/useRazorpay.js` (lines 30–33)

### The Problem:
In `paymentController.js`, the order creation endpoint trusts whatever `amount` the client sends in the HTTP request body:

```javascript
// Backend/controllers/paymentController.js
const createOrder = async (req, res) => {
  const { amount, currency = 'INR', receipt } = req.body; // ⚠️ TRUSTING CLIENT INPUT
  
  const options = {
    amount: Math.round(amount * 100), // Converted to paise
    currency,
    receipt: receipt || `receipt_${Date.now()}`
  };

  const order = await razorpayInstance.orders.create(options);
  res.status(200).json({ success: true, order });
};
```

And in `verifyPayment`:
```javascript
const isAuthentic = expectedSignature === razorpay_signature;

if (isAuthentic) {
  // ⚠️ Only checks if the cryptographic signature matches the order.
  // NEVER verifies if the amount actually paid equals the real booking cost in MongoDB!
  await Booking.findByIdAndUpdate(bookingId, { paymentStatus: 'Paid', status: 'confirmed' });
}
```

### How an Attacker Exploits This:
1. A guest initiates a booking for the *Chalet Presidential Suite* for **₹8,500**.
2. A pending booking document is saved in MongoDB with `totalAmount: 8500`.
3. Before the Razorpay modal opens, the attacker opens browser DevTools (Network tab) or uses Postman to intercept the call to `/api/payments/create-order`.
4. The attacker changes `{ amount: 8500, receipt: bookingId }` to `{ amount: 1, receipt: bookingId }`.
5. Your backend asks Razorpay to generate an official order for **₹1 (100 paise)**.
6. The attacker completes the payment of ₹1 via UPI / Card. Razorpay generates an authentic, cryptographically valid signature for this ₹1 order.
7. The attacker's browser submits `razorpay_order_id`, `razorpay_payment_id`, and `razorpay_signature` to `/api/payments/verify-payment`.
8. The backend verifies that the HMAC-SHA256 signature is valid and **marks the ₹8,500 suite as "Confirmed & Paid" for just ₹1**.

### Recommended Fix:
- The frontend must **only send `{ bookingId, bookingType }`** to `/create-order`.
- The backend must query MongoDB: `const booking = await Booking.findById(bookingId);`.
- The backend must use `booking.totalAmount` to create the Razorpay order.
- In `verifyPayment`, the backend must fetch the order details from Razorpay's API and verify:
  `if (order.amount_paid !== booking.totalAmount * 100) throw new Error('Amount mismatch');`.

---

## 🔴 Issue 2: Missing Razorpay Webhook (Dropped & Interrupted Transactions)

- **Severity:** 🔴 **CRITICAL (Customer Complaints & Failed Bookings)**
- **Affected Files:**
  - `Backend/routes/paymentRoutes.js`
  - `Backend/controllers/paymentController.js`

### The Problem:
Currently, booking confirmation and email dispatch rely **100% on the user's browser frontend** executing the `handler` callback inside `useRazorpay.js`:

```javascript
// Frontend/shared/hooks/useRazorpay.js
handler: async function (response) {
  // If the browser closes before this line runs, NOTHING gets saved!
  await apiClient.post('/payments/verify-payment', { ... });
}
```

### The Scenario:
1. A customer enters their UPI PIN or OTP on their phone.
2. The customer's bank successfully debits ₹4,500.
3. Razorpay captures the payment.
4. **Before the browser can execute the callback:**
   - The user's mobile internet fluctuates or disconnects in hill areas (common in Almora/Kumaon).
   - The user's phone battery runs out.
   - The user accidentally closes the browser tab or presses the "Back" button thinking payment is finished.
5. The frontend never calls `/api/payments/verify-payment`.

### Impact:
- The customer's money is debited from their bank account.
- The MongoDB booking remains stuck in `status: 'pending'` and `paymentStatus: 'Unpaid'`.
- The hotel receives no confirmation email, the room is not reserved, and the customer assumes they have been scammed.

### Recommended Fix:
- Add a dedicated **Razorpay Webhook endpoint** on the backend: `POST /api/payments/webhook`.
- Listen for the `payment.captured` and `order.paid` events.
- Validate the webhook signature using `RAZORPAY_WEBHOOK_SECRET`.
- When Razorpay's server contacts your webhook, automatically update the booking to `Paid` and trigger confirmation emails, even if the user's browser disconnected.

---

## 🟠 Issue 3: Duplicate Payment Replay (Reusing Single Payment ID)

- **Severity:** 🟠 **HIGH (Data Integrity & Exploitation Risk)**
- **Affected Files:**
  - `Backend/models/Booking.js`
  - `Backend/models/TravelBooking.js`
  - `Backend/controllers/paymentController.js`

### The Problem:
In both `Booking.js` and `TravelBooking.js`:
```javascript
razorpayPaymentId: { type: String }, // ⚠️ No unique constraint
```

There is no check preventing the same `razorpay_payment_id` from being submitted multiple times. A malicious user who has a single valid payment response could submit that identical payload for a second booking with a different `bookingId`.

### Recommended Fix:
1. Add a unique index to the MongoDB schemas:
   ```javascript
   razorpayPaymentId: { type: String, unique: true, sparse: true }
   ```
2. Before updating in `verifyPayment`, verify that no existing booking already has this `razorpay_payment_id`:
   ```javascript
   const existing = await Booking.findOne({ razorpayPaymentId: razorpay_payment_id });
   if (existing) {
     return res.status(400).json({ success: false, message: 'Payment already processed' });
   }
   ```

---

## 🟡 Issue 4: Timing Side-Channel Vulnerability on Signature Verification

- **Severity:** 🟡 **MEDIUM (Security Best Practice)**
- **Affected File:**
  - `Backend/controllers/paymentController.js` (line 60)

### The Problem:
```javascript
const isAuthentic = expectedSignature === razorpay_signature; // ⚠️ Standard string equality
```

Standard JavaScript `===` compares strings character-by-character and returns `false` as soon as the first non-matching byte is found. In security-sensitive financial applications, this small timing difference can theoretically be measured by an attacker to deduce characters of the expected hash.

### Recommended Fix:
Use Node.js's built-in constant-time comparison:
```javascript
const isAuthentic = crypto.timingSafeEqual(
  Buffer.from(expectedSignature),
  Buffer.from(razorpay_signature)
);
```

---

## 🔵 Issue 5: Live Production Credentials & Environment Segregation

- **Severity:** 🔵 **OPERATIONAL (Go-Live Requirement)**
- **Affected File:**
  - `Backend/.env` (lines 29–30)

### The Problem:
The backend currently contains Sandbox/Test keys:
```env
RAZORPAY_KEY_ID=rzp_test_TlPDLKaDVTz7mi
RAZORPAY_KEY_SECRET=FAK3xhns65OYA4xpV0rn4WwM
```

### Impact:
- When real customers attempt to pay with real UPI apps (Google Pay, PhonePe, Paytm) or debit/credit cards on a production domain, transactions will fail or will only operate in Test Mode without transferring actual funds to your bank account.

### Recommended Fix:
1. Generate **Live API Keys** from the Razorpay Dashboard (`Settings > API Keys > Generate Key`).
2. Update production environment variables:
   ```env
   RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=your_live_secret_key
   RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_key
   ```

---

## 🛠️ Summary Action Plan Before Launch

| # | Action Item | Target File(s) | Priority |
|---|---|---|---|
| **1** | Fetch price from MongoDB rather than client `req.body.amount` | `paymentController.js` (`createOrder`) | 🔴 Critical |
| **2** | Cross-verify paid amount matches database total in `verifyPayment` | `paymentController.js` (`verifyPayment`) | 🔴 Critical |
| **3** | Add Razorpay Webhook endpoint (`payment.captured`) | `paymentController.js`, `paymentRoutes.js` | 🔴 Critical |
| **4** | Enforce unique payment IDs to prevent replay attacks | `Booking.js`, `TravelBooking.js` | 🟠 High |
| **5** | Use `crypto.timingSafeEqual` for constant-time signature comparison | `paymentController.js` | 🟡 Medium |
| **6** | Replace `rzp_test_` keys with live `rzp_live_` merchant credentials | `Backend/.env` | 🔵 Go-Live |
