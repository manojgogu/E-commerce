import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axiosInstance';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    category: searchParams.get('category') || '',
    minPrice: '', maxPrice: '',
    sort: 'newest', page: 1,
  });

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data));
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== '')
      );
      const { data } = await api.get('/products', { params });
      setProducts(data.products);
      setTotal(data.total);
      setLoading(false);
    };
    fetchProducts();
  }, [filters]);

  const updateFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value, page: 1 }));

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">All Products <span className="text-muted fs-5">({total})</span></h2>
      <div className="row g-4">
        {/* SIDEBAR */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3">
            <h6 className="fw-bold mb-3">🔍 Filters</h6>
            <input className="form-control mb-3" placeholder="Search products..."
              value={filters.keyword}
              onChange={(e) => updateFilter('keyword', e.target.value)} />

            <label className="form-label fw-semibold">Category</label>
            <select className="form-select mb-3" value={filters.category}
              onChange={(e) => updateFilter('category', e.target.value)}>
              <option value="">All Categories</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>

            <label className="form-label fw-semibold">Sort By</label>
            <select className="form-select mb-3" value={filters.sort}
              onChange={(e) => updateFilter('sort', e.target.value)}>
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
              <option value="rating">Best Rated</option>
            </select>

            <label className="form-label fw-semibold">Price Range (₹)</label>
            <div className="d-flex gap-2">
              <input className="form-control" type="number" placeholder="Min"
                value={filters.minPrice} onChange={(e) => updateFilter('minPrice', e.target.value)} />
              <input className="form-control" type="number" placeholder="Max"
                value={filters.maxPrice} onChange={(e) => updateFilter('maxPrice', e.target.value)} />
            </div>
            <button className="btn btn-outline-dark btn-sm mt-3 w-100"
              onClick={() => setFilters({ keyword: '', category: '', minPrice: '', maxPrice: '', sort: 'newest', page: 1 })}>
              Reset Filters
            </button>
          </div>
        </div>

        {/* GRID */}
        <div className="col-md-9">
          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-warning"></div></div>
          ) : products.length === 0 ? (
            <div className="text-center py-5 text-muted"><p className="fs-5">No products found.</p></div>
          ) : (
            <div className="row g-4">
              {products.map((p) => (
                <div className="col-sm-6 col-xl-4" key={p._id}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
