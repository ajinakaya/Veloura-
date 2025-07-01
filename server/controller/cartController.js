const Cart = require('../models/cart');

// Add to Cart
const addToCart = async (req, res) => {
  const { jewelryId, quantity } = req.body;
  const userId = req.user._id;

  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [{ jwelery: jewelryId, quantity }]
      });
    } else {
      const itemIndex = cart.items.findIndex(item => item.jwelery.toString() === jewelryId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ jwelery: jewelryId, quantity });
      }
    }

    await cart.save();

    const populatedCart = await Cart.findOne({ user: userId }).populate('items.jwelery');
    res.status(200).json(populatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Cart
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.jwelery');
    res.status(200).json(cart || { items: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove from Cart
const removeFromCart = async (req, res) => {
  const { jewelryId } = req.body;

  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.jwelery.toString() !== jewelryId);
    await cart.save();

    const populatedCart = await Cart.findOne({ user: req.user._id }).populate('items.jwelery');
    res.status(200).json(populatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
};
