const express = require('express');
const { createOrder, verifyPayment, getKey } = require('../controllers/paymentController');

const router = express.Router();

router.get('/get-key', getKey);
router.post('/create-order', createOrder);
router.post('/verify-payment', verifyPayment);

module.exports = router;
