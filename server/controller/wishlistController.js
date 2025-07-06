const Wishlist = require('../models/wishlist');

const addToWishlist = async (req, res) => {
  const { jewelryId } = req.body;
  const userId = req.user._id;

  try {
    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, items: [{ jewelry: jewelryId }] });
    } else {
      const exists = wishlist.items.some(item => item.jewelry.toString() === jewelryId);
      if (!exists) {
        wishlist.items.push({ jewelry: jewelryId });
      }
    }

    await wishlist.save();

    const populatedWishlist = await Wishlist.findOne({ user: userId }).populate('items.jewelry');

    res.status(200).json(populatedWishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate('items.jewelry');
    res.status(200).json(wishlist || { items: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeFromWishlist = async (req, res) => {
  const { jewelryId } = req.body;

  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });

    wishlist.items = wishlist.items.filter(item => item.jewelry.toString() !== jewelryId);
    await wishlist.save();

    const populatedWishlist = await Wishlist.findOne({ user: req.user._id }).populate('items.jewelry');

    res.status(200).json(populatedWishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
};
