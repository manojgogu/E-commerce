import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axiosInstance';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { FiStar, FiHeart } from 'react-icons/fi';
import { toast } from 'react-toastify';

const StarRating = ({ rating }) => (
  <span>
    {[1, 2, 3, 4, 5].map((s) => (
      <FiStar key={s} className={s <= Math.round(rating) ? 'text-warning' : 'text-muted'} />
    ))}
  </span>
);

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [mainImg, setMainImg] = useState(0);
  const [review, setReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    api.get(`/products/${id}`).then(({ data }) => setProduct(data));
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to review');
    try {
      await api.post(`/products/${id}/reviews`, review);
      toast.success('Review submitted!');
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error submitting review');
    }
  };

  if (!product) return (
    <div className="text-center py-5"><div className="spinner-border text-warning"></div></div>
  );

  const price = product.discountPrice || product.price;

  return (
    <div className="container py-5">
      <div className="row g-5">
        {/* Images */}
        <div className="col-md-6">
          <img
            src={product.images?.[mainImg] || 'https://via.placeholder.com/600'}
            className="img-fluid rounded-3 shadow mb-3 w-100"
            style={{ maxHeight: 420, objectFit: 'cover' }} alt={product.name}
          />
          <div className="d-flex gap-2">
            {product.images?.map((img, i) => (
              <img key={i} src={img} alt="" className={`img-thumbnail cursor-pointer ${mainImg === i ? 'border-warning' : ''}`}
                style={{ width: 70, height: 70, objectFit: 'cover', cursor: 'pointer' }}
                onClick={() => setMainImg(i)} />
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="col-md-6">
          <span className="badge bg-secondary mb-2">{product.category?.name}</span>
          <h2 className="fw-bold">{product.name}</h2>
          <div className="d-flex align-items-center gap-2 mb-3">
            <StarRating rating={product.rating} />
            <small className="text-muted">{product.numReviews} reviews</small>
          </div>
          <div className="mb-3">
            <span className="fs-3 fw-bold text-dark">₹{price.toLocaleString()}</span>
            {product.discountPrice > 0 && (
              <span className="text-muted text-decoration-line-through ms-2">₹{product.price.toLocaleString()}</span>
            )}
          </div>
          <p className="text-muted">{product.description}</p>

          {product.stock > 0 ? (
            <div className="d-flex align-items-center gap-3 my-3">
              <div className="input-group" style={{ width: 130 }}>
                <button className="btn btn-outline-dark" onClick={() => setQty((q) => Math.max(1, q - 1))}>-</button>
                <input className="form-control text-center" value={qty} readOnly />
                <button className="btn btn-outline-dark"
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}>+</button>
              </div>
              <small className="text-muted">{product.stock} in stock</small>
            </div>
          ) : (
            <span className="badge bg-danger fs-6 mb-3">Out of Stock</span>
          )}

          <div className="d-flex gap-3 mt-2">
            <button className="btn btn-warning px-4 fw-semibold"
              onClick={() => addToCart(product._id, qty)} disabled={product.stock === 0}>
              Add to Cart
            </button>
            <button
              className={`btn d-flex align-items-center gap-2 ${isInWishlist(product._id) ? 'btn-danger' : 'btn-outline-danger'}`}
              onClick={() => toggleWishlist(product._id)}
            >
              <FiHeart fill={isInWishlist(product._id) ? 'white' : 'none'} />
              {isInWishlist(product._id) ? 'Wishlisted' : 'Wishlist'}
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="row mt-5">
        <div className="col-md-8">
          <h4 className="fw-bold mb-4">Customer Reviews</h4>
          {product.reviews?.length === 0 && (
            <p className="text-muted">No reviews yet. Be the first!</p>
          )}
          {product.reviews?.map((r, i) => (
            <div className="card border-0 shadow-sm mb-3 p-3" key={i}>
              <div className="d-flex justify-content-between">
                <strong>{r.name}</strong>
                <StarRating rating={r.rating} />
              </div>
              <p className="mt-2 mb-0">{r.comment}</p>
              <small className="text-muted">{new Date(r.createdAt).toLocaleDateString()}</small>
            </div>
          ))}

          {user && (
            <div className="card border-0 shadow-sm p-4 mt-4">
              <h5 className="fw-bold mb-3">Write a Review</h5>
              <form onSubmit={submitReview}>
                <div className="mb-3">
                  <label className="form-label">Rating</label>
                  <select className="form-select" value={review.rating}
                    onChange={(e) => setReview({ ...review, rating: +e.target.value })}>
                    {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} ⭐</option>)}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Comment</label>
                  <textarea className="form-control" rows={3} required value={review.comment}
                    onChange={(e) => setReview({ ...review, comment: e.target.value })} />
                </div>
                <button type="submit" className="btn btn-warning">Submit Review</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
