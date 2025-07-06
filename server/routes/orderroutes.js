const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../security/authentication');
const {
  createOrder,
  getUserOrders,
  getOrder,
  updatePaymentStatus,
  cancelOrder, 
  getAllOrders,     
  getOrderById,      
  updateOrderStatus, 

} = require('../controller/ordercontroller');

// Order Routes
router.post('/create', authenticateToken, createOrder);
router.get('/user', authenticateToken, getUserOrders);
router.get('/:orderNumber', authenticateToken, getOrder);
router.put('/cancel/:orderNumber', authenticateToken, cancelOrder);
router.put('/paymentstatus', updatePaymentStatus);
router.get('/admin/all', authenticateToken, getAllOrders);     
router.get('/admin/:orderId', authenticateToken, getOrderById);     
router.put('/admin/:orderId/status', authenticateToken, updateOrderStatus)


module.exports = router;
