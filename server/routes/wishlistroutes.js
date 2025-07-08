const express = require('express');
const router = express.Router();
const { authenticateToken } = require("../security/authentication");
const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} = require('../controller/wishlistController');

// Wishlist Routes
router.post('/add', authenticateToken, addToWishlist);
router.get('/get', authenticateToken, getWishlist);
router.delete('/remove', authenticateToken, removeFromWishlist);

module.exports = router;
