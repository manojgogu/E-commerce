const Order = require('../models/Order');
const Cart = require('../models/Cart');

// @POST /api/orders
const placeOrder = async (req, res) => {
  const { items, shippingAddress, paymentMethod, totalPrice } = req.body;
  if (!items || items.length === 0)
    return res.status(400).json({ message: 'No items in order' });

  const order = await Order.create({
    user: req.user._id, items, shippingAddress,
    paymentMethod: paymentMethod || 'COD', totalPrice,
  });
  // Clear cart after placing order
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
  res.status(201).json(order);
};

// @GET /api/orders/my
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

// @GET /api/orders/:id
const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin')
    return res.status(403).json({ message: 'Not authorized' });
  res.json(order);
};

// @GET /api/orders  (admin)
const getAllOrders = async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.json(orders);
};

// @PUT /api/orders/:id/status  (admin)
const updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.orderStatus = req.body.orderStatus || order.orderStatus;
  if (req.body.orderStatus === 'delivered') order.deliveredAt = new Date();
  await order.save();
  res.json(order);
};

module.exports = { placeOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus };
