import { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import { FiTrash2, FiEdit2 } from 'react-icons/fi';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', discountPrice: '', description: '', images: '', stock: '', category: '', brand: '', featured: false });
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const { data } = await api.get('/products?limit=100');
    setProducts(data.products);
    const catData = await api.get('/categories');
    setCategories(catData.data);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      discountPrice: Number(form.discountPrice) || 0,
      stock: Number(form.stock),
      images: form.images ? form.images.split(',').map((s) => s.trim()) : [],
    };
    try {
      if (editing) {
        await api.put(`/products/${editing}`, payload);
        toast.success('Product updated!');
      } else {
        await api.post('/products', payload);
        toast.success('Product created!');
      }
      setForm({ name: '', price: '', discountPrice: '', description: '', images: '', stock: '', category: '', brand: '', featured: false });
      setEditing(null);
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    toast.success('Product deleted');
    load();
  };

  const startEdit = (p) => {
    setEditing(p._id);
    setForm({ ...p, images: p.images?.join(', '), category: p.category?._id || p.category, featured: p.featured });
    window.scrollTo(0, 0);
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">📦 Manage Products</h2>
      {/* Form */}
      <div className="card border-0 shadow-sm p-4 mb-5">
        <h5 className="fw-bold mb-3">{editing ? 'Edit Product' : 'Add New Product'}</h5>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            {[
              { label: 'Product Name', key: 'name', type: 'text' },
              { label: 'Brand', key: 'brand', type: 'text' },
              { label: 'Price (₹)', key: 'price', type: 'number' },
              { label: 'Discount Price (₹)', key: 'discountPrice', type: 'number' },
              { label: 'Stock', key: 'stock', type: 'number' },
            ].map(({ label, key, type }) => (
              <div className="col-md-4" key={key}>
                <label className="form-label fw-semibold">{label}</label>
                <input type={type} className="form-control" required={key !== 'discountPrice' && key !== 'brand'}
                  value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
              </div>
            ))}
            <div className="col-md-4">
              <label className="form-label fw-semibold">Category</label>
              <select className="form-select" required value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="">Select</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div className="col-12">
              <label className="form-label fw-semibold">Image URLs (comma-separated)</label>
              <input className="form-control" value={form.images}
                onChange={(e) => setForm({ ...form, images: e.target.value })} />
            </div>
            <div className="col-12">
              <label className="form-label fw-semibold">Description</label>
              <textarea className="form-control" rows={3} required value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="col-12 form-check ms-2">
              <input className="form-check-input" type="checkbox" id="featured" checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
              <label className="form-check-label fw-semibold" htmlFor="featured">Featured Product</label>
            </div>
          </div>
          <div className="d-flex gap-2 mt-3">
            <button type="submit" className="btn btn-warning fw-semibold">
              {editing ? 'Update Product' : 'Add Product'}
            </button>
            {editing && (
              <button type="button" className="btn btn-outline-secondary"
                onClick={() => { setEditing(null); setForm({ name: '', price: '', discountPrice: '', description: '', images: '', stock: '', category: '', brand: '', featured: false }); }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="table-responsive card border-0 shadow-sm p-3">
        <table className="table table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>Image</th><th>Name</th><th>Category</th>
              <th>Price</th><th>Stock</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td><img src={p.images?.[0] || 'https://via.placeholder.com/50'} style={{ width: 50, height: 50, objectFit: 'cover' }} className="rounded" alt="" /></td>
                <td className="fw-semibold">{p.name}</td>
                <td><span className="badge bg-secondary">{p.category?.name}</span></td>
                <td>₹{p.price?.toLocaleString()}</td>
                <td><span className={`badge ${p.stock > 0 ? 'bg-success' : 'bg-danger'}`}>{p.stock}</span></td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => startEdit(p)}><FiEdit2 /></button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p._id)}><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageProducts;
