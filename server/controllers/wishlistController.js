const Wishlist = require('../models/Wishlist');

// @GET /api/wishlist
const getWishlist = async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products', 'name images price rating');
  res.json(wishlist || { products: [] });
};

// @POST /api/wishlist/:productId
const addToWishlist = async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) wishlist = new Wishlist({ user: req.user._id, products: [] });

  if (!wishlist.products.includes(req.params.productId)) {
    wishlist.products.push(req.params.productId);
    await wishlist.save();
  }
  res.json(wishlist);
};

// @DELETE /api/wishlist/:productId
const removeFromWishlist = async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });
  wishlist.products = wishlist.products.filter((p) => p.toString() !== req.params.productId);
  await wishlist.save();
  res.json(wishlist);
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
