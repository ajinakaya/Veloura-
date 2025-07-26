const express = require('express');
const { createCheckoutSession, } = require('../controller/stripeController');

const router = express.Router();

router.post('/create-checkout-session', createCheckoutSession);
// router.post('/webhook', express.raw({ type: 'application/json' }), paymentWebhook);

module.exports = router;