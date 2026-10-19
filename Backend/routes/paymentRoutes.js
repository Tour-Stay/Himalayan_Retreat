const express = require('express');
const { createOrder, verifyPayment, getKey, handleWebhook } = require('../controllers/paymentController');

const router = express.Router();

router.get('/get-key', getKey);
router.post('/create-order', createOrder);
router.post('/verify-payment', verifyPayment);
router.post('/webhook', handleWebhook);

module.exports = router;
