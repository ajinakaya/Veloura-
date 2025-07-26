const Stripe = require('stripe');
const Order = require('../models/order.js');
const dotenv = require('dotenv');

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const createCheckoutSession = async (req, res) => {
  try {
    const { items, orderId } = req.body;
    console.log("Received request to create Stripe session."); 
    console.log("Items:", items);                            
    console.log("Order ID received from frontend:", orderId);
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: { name: item.name },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${order.orderNumber}`,
      cancel_url: 'http://localhost:5173/cancel',
      metadata: {
        orderNumber: order.orderNumber,
        yourDbOrderId: order._id.toString(),
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Checkout session error:', error.message);
    res.status(500).json({ error: 'Failed to create session' });
  }
};


const paymentWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    const eventType = event.type;
    const data = event.data.object;

    const orderNumber = data.metadata?.orderNumber;
    const yourDbOrderId = data.metadata?.yourDbOrderId; 
    const transactionId = data.id; 

    if (!orderNumber && !yourDbOrderId) {
        return res.status(400).send('Order identifier not found in webhook payload');
    }

    let order;
    if (yourDbOrderId) {
        order = await Order.findById(yourDbOrderId); 
    } else {
        order = await Order.findOne({ orderNumber }); 
    }

    if (!order) {
      console.warn(`Order not found for orderNumber: ${orderNumber} or yourDbOrderId: ${yourDbOrderId}`);
      return res.status(404).send('Order not found');
    }

    if (eventType === 'checkout.session.completed' || eventType === 'payment_intent.succeeded') {

      order.payment.status = 'PAID';
      order.payment.transactionId = transactionId;
      order.status = 'CONFIRMED';
      await order.save();
      return res.status(200).send('Payment successful and order updated');
    }

    if (eventType === 'payment_intent.payment_failed' || eventType === 'checkout.session.async_payment_failed') {
      order.payment.status = 'FAILED';
      order.payment.transactionId = transactionId;
      await order.save();
      return res.status(200).send('Payment failed and order updated');
    }

    res.status(200).send('Event received, no action taken');
  } catch (error) {
    console.error('Webhook processing error:', error.message);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = {
  createCheckoutSession,
  paymentWebhook,

};