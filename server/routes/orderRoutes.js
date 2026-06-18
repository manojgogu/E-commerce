const express = require('express');
const router = express.Router();
const {
  placeOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

router.use(protect);
router.post('/', placeOrder);
router.get('/my', getMyOrders);
router.get('/:id', getOrderById);
router.get('/', admin, getAllOrders);
router.put('/:id/status', admin, updateOrderStatus);

module.exports = router;
