import { useWishlist } from '../context/WishlistContext';
import { FiTrash2 } from 'react-icons/fi';

const Wishlist = () => {
  const { wishlistItems: products, removeFromWishlist, loading } = useWishlist();

  if (loading) return (
    <div className="container py-5 text-center">
      <div className="spinner-border text-warning" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (!products?.length) return (
    <div className="container py-5 text-center">
      <div className="fs-1 mb-3">❤️</div>
      <h4 className="text-muted">Your wishlist is empty</h4>
      <Link to="/products" className="btn btn-warning mt-3">Browse Products</Link>
    </div>
  );

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">My Wishlist ({products.length})</h2>
      <div className="row g-4">
        {products.map((p) => (
          <div className="col-sm-6 col-md-4 col-lg-3" key={p._id}>
            <div className="card border-0 shadow-sm h-100">
              <img src={p.images?.[0] || 'https://via.placeholder.com/200'}
                className="card-img-top" style={{ height: 180, objectFit: 'cover' }} alt={p.name} />
              <div className="card-body">
                <h6 className="fw-semibold text-truncate">{p.name}</h6>
                <p className="fw-bold text-dark">₹{(p.discountPrice || p.price)?.toLocaleString()}</p>
                <div className="d-flex gap-2">
                  <Link to={`/products/${p._id}`} className="btn btn-warning btn-sm flex-fill">View</Link>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => removeFromWishlist(p._id)}>
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
