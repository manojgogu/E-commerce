import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosInstance';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get('/products?limit=8&sort=newest').then(({ data }) => setFeatured(data.products));
    api.get('/categories').then(({ data }) => setCategories(data));
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="hero-section text-white d-flex align-items-center"
        style={{ minHeight: '520px', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <span className="badge bg-warning text-dark mb-3 fs-6 px-3 py-2">🔥 Big Sale — Up to 50% Off</span>
              <h1 className="display-4 fw-bold mb-3">Shop Everything.<br />
                <span className="text-warning">Delivered Fast.</span>
              </h1>
              <p className="lead text-light mb-4">
                Discover thousands of products at unbeatable prices. Shop smarter with ShopEZ.
              </p>
              <div className="d-flex gap-3">
                <Link to="/products" className="btn btn-warning btn-lg px-4 fw-semibold">
                  Shop Now
                </Link>
                <Link to="/register" className="btn btn-outline-light btn-lg px-4">
                  Join Free
                </Link>
              </div>
            </div>
            <div className="col-lg-6 text-center mt-4 mt-lg-0">
              <div className="row g-3">
                {[{ icon: '🚚', label: 'Free Shipping', sub: 'On orders ₹500+' },
                  { icon: '🔒', label: 'Secure Pay', sub: 'SSL Encrypted' },
                  { icon: '↩️', label: 'Easy Returns', sub: '7-day policy' },
                  { icon: '⭐', label: 'Top Rated', sub: '10k+ reviews' }
                ].map((f, i) => (
                  <div className="col-6" key={i}>
                    <div className="rounded-3 p-3 text-center" style={{ background: 'rgba(255,255,255,0.1)' }}>
                      <div className="fs-2">{f.icon}</div>
                      <div className="fw-semibold">{f.label}</div>
                      <small className="text-light">{f.sub}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      {categories.length > 0 && (
        <section className="py-5 bg-light">
          <div className="container">
            <h2 className="fw-bold mb-4 text-center">Shop by Category</h2>
            <div className="row g-3 justify-content-center">
              {categories.slice(0, 6).map((cat) => (
                <div className="col-6 col-md-4 col-lg-2" key={cat._id}>
                  <Link to={`/products?category=${cat._id}`}
                    className="card text-center border-0 shadow-sm text-decoration-none h-100 p-3 category-card">
                    <div className="fs-1">{cat.image || '📦'}</div>
                    <div className="fw-semibold text-dark mt-2">{cat.name}</div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FEATURED PRODUCTS */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold mb-0">Latest Products</h2>
            <Link to="/products" className="btn btn-outline-dark btn-sm">View All →</Link>
          </div>
          <div className="row g-4">
            {featured.map((p) => (
              <div className="col-sm-6 col-md-4 col-lg-3" key={p._id}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-dark text-light py-4 mt-5">
        <div className="container text-center">
          <div className="fw-bold fs-5 text-warning mb-2">🛒 ShopEZ</div>
          <p className="text-muted small mb-0">© 2024 ShopEZ. Built with MERN Stack.</p>
        </div>
      </footer>
    </>
  );
};

export default Home;
