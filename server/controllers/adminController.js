const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @GET /api/admin/stats
const getDashboardStats = async (req, res) => {
  const totalUsers = await User.countDocuments({ role: 'user' });
  const totalProducts = await Product.countDocuments();
  const totalOrders = await Order.countDocuments();
  const revenue = await Order.aggregate([
    { $match: { orderStatus: { $ne: 'cancelled' } } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } },
  ]);
  res.json({
    totalUsers, totalProducts, totalOrders,
    totalRevenue: revenue[0]?.total || 0,
  });
};

// @GET /api/admin/users
const getAllUsers = async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
};

// @DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
};

module.exports = { getDashboardStats, getAllUsers, deleteUser };
