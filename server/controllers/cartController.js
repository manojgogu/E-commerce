const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @GET /api/cart
const getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name images price stock');
  res.json(cart || { items: [] });
};

// @POST /api/cart
const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = new Cart({ user: req.user._id, items: [] });

  const idx = cart.items.findIndex((i) => i.product.toString() === productId);
  if (idx >= 0) {
    cart.items[idx].quantity += quantity || 1;
  } else {
    cart.items.push({ product: productId, quantity: quantity || 1, price: product.price });
  }
  await cart.save();
  res.json(cart);
};

// @PUT /api/cart/:productId
const updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  const idx = cart.items.findIndex((i) => i.product.toString() === req.params.productId);
  if (idx < 0) return res.status(404).json({ message: 'Item not in cart' });

  if (quantity <= 0) cart.items.splice(idx, 1);
  else cart.items[idx].quantity = quantity;

  await cart.save();
  res.json(cart);
};

// @DELETE /api/cart/:productId
const removeFromCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });
  cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
  await cart.save();
  res.json(cart);
};

// @DELETE /api/cart
const clearCart = async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
  res.json({ message: 'Cart cleared' });
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
