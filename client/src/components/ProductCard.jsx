import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { FiStar, FiHeart } from 'react-icons/fi';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product._id);
  const discount = product.discountPrice > 0
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="card h-100 shadow-sm border-0 product-card">
      <div className="position-relative overflow-hidden" style={{ height: '200px' }}>
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/400x200?text=No+Image'}
          alt={product.name}
          className="card-img-top h-100 w-100"
          style={{ objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)', backgroundColor: '#eee' }}
        />
        {discount > 0 && (
          <span className="badge bg-danger position-absolute top-0 end-0 m-2 shadow-sm" style={{ zIndex: 1 }}>{discount}% OFF</span>
        )}
        {product.stock === 0 && (
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1 }}>
            <span className="badge bg-dark fs-6">Out of Stock</span>
          </div>
        )}
        <button
          className={`btn btn-white btn-sm position-absolute top-0 start-0 m-2 shadow-sm rounded-circle d-flex align-items-center justify-content-center transition-all ${isWishlisted ? 'text-danger' : 'text-muted'}`}
          style={{ width: 36, height: 36, zIndex: 2, background: 'white', border: 'none' }}
          onClick={(e) => { e.preventDefault(); toggleWishlist(product._id); }}
        >
          <FiHeart fill={isWishlisted ? 'currentColor' : 'none'} size={18} />
        </button>
      </div>
      <div className="card-body d-flex flex-column">
        <p className="text-muted small mb-1">{product.category?.name}</p>
        <h6 className="card-title fw-semibold mb-1 text-truncate">{product.name}</h6>
        <div className="d-flex align-items-center gap-1 mb-2">
          <FiStar className="text-warning" size={13} />
          <small>{product.rating?.toFixed(1)} ({product.numReviews})</small>
        </div>
        <div className="mt-auto">
          <div className="d-flex align-items-center gap-2 mb-2">
            <span className="fw-bold text-dark fs-5">
              ₹{(product.discountPrice || product.price).toLocaleString()}
            </span>
            {discount > 0 && (
              <span className="text-muted text-decoration-line-through small">₹{product.price.toLocaleString()}</span>
            )}
          </div>
          <div className="d-flex gap-2">
            <Link to={`/products/${product._id}`} className="btn btn-outline-dark btn-sm flex-fill">
              View
            </Link>
            <button
              className="btn btn-warning btn-sm flex-fill"
              onClick={() => addToCart(product._id)}
              disabled={product.stock === 0}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
