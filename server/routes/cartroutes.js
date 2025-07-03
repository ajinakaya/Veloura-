const express = require('express');
const router = express.Router();
const { authenticateToken } = require("../security/authentication");
const {
  addToCart,
  getCart,
  removeFromCart,
} = require('../controller/cartController');

// Cart Routes
router.post('/add', authenticateToken, addToCart);
router.get('/get', authenticateToken, getCart);
router.delete('/remove', authenticateToken, removeFromCart);

module.exports = router;
