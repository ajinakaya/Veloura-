const Order = require('../models/order');
const Cart = require('../models/cart');
const ShippingRate = require('../models/shippingrate');

// Create Order
const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      shippingMethod,
      shippingAddress,
      paymentMethod
    } = req.body;

    const cart = await Cart.findOne({ user: userId }).populate('items.jewelry');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const shippingRate = await ShippingRate.findOne({ method: shippingMethod, isActive: true });
    if (!shippingRate) {
      return res.status(400).json({ message: "Invalid or inactive shipping method" });
    }

    const cartItems = cart.items.map(item => ({
      jewelry: item.jewelry._id,
      quantity: item.quantity,
      price: item.jewelry.price
    }));

    const subtotal = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const shippingCost = shippingRate.cost;
    const total = subtotal + shippingCost;

    const order = new Order({
      user: userId,
      cartItems,
      shippingMethod: shippingRate._id,
      shippingAddress: {
        firstName: shippingAddress.firstName,
        lastName: shippingAddress.lastName,
        companyName: shippingAddress.companyName || '',
        streetAddress: shippingAddress.streetAddress,
        city: shippingAddress.city,
        province: shippingAddress.province,
        country: shippingAddress.country || 'Nepal',
        phone: shippingAddress.phone,
        email: shippingAddress.email,
        additionalInfo: shippingAddress.additionalInfo || ''
      },
      payment: {
        method: paymentMethod,
        status: 'PENDING'
      },
      subtotal,
      shippingCost,
      total
    });

    await order.save();

    await Cart.findOneAndUpdate({ user: userId }, { items: [] });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      orderNumber: order.orderNumber,
      total: order.total,
      status: order.status
    });

  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all orders for a user
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId })
      .populate('cartItems.jewelry')
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single order
const getOrder = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const userId = req.user._id;

    const order = await Order.findOne({ orderNumber, user: userId })
      .populate('cartItems.jewelry')
      .populate('shippingMethod');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update payment status
const updatePaymentStatus = async (req, res) => {
  try {
    const { orderNumber, status, transactionId } = req.body;

    const order = await Order.findOne({ orderNumber });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.payment.status = status;
    if (transactionId) {
      order.payment.transactionId = transactionId;
    }

    if (status === 'PAID') {
      order.status = 'CONFIRMED';
    }

    await order.save();

    res.status(200).json({ success: true, message: 'Payment status updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const userId = req.user._id;

    const order = await Order.findOne({ orderNumber, user: userId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
      return res.status(400).json({ message: 'Order cannot be cancelled at this stage' });
    }

    order.status = 'CANCELLED';
    await order.save();

    res.status(200).json({ success: true, message: 'Order cancelled successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



module.exports = {
  createOrder,
  getUserOrders,
  getOrder,
  updatePaymentStatus,
  cancelOrder,
 
};
