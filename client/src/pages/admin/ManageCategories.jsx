import { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import { FiTrash2, FiEdit2 } from 'react-icons/fi';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', slug: '', image: '', description: '' });
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const { data } = await api.get('/categories');
    setCategories(data);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/categories/${editing}`, form);
        toast.success('Category updated!');
      } else {
        await api.post('/categories', form);
        toast.success('Category created!');
      }
      setForm({ name: '', slug: '', image: '', description: '' });
      setEditing(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  const startEdit = (c) => {
    setEditing(c._id);
    setForm({ name: c.name, slug: c.slug, image: c.image || '', description: c.description || '' });
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Category deleted');
      load();
    } catch (err) {
      toast.error('Cannot delete: Category may be in use');
    }
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">📂 Manage Categories</h2>
      
      {/* Form */}
      <div className="card border-0 shadow-sm p-4 mb-5">
        <h5 className="fw-bold mb-3">{editing ? 'Edit Category' : 'Add New Category'}</h5>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Category Name</label>
              <input type="text" className="form-control" required value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })} />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Slug</label>
              <input type="text" className="form-control" required value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Icon Emoji (or Image URL)</label>
              <input type="text" className="form-control" value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="e.g. 📱 or http://..." />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Description</label>
              <input type="text" className="form-control" value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>
          <div className="d-flex gap-2 mt-3">
            <button type="submit" className="btn btn-warning fw-semibold">
              {editing ? 'Update Category' : 'Add Category'}
            </button>
            {editing && (
              <button type="button" className="btn btn-outline-secondary"
                onClick={() => { setEditing(null); setForm({ name: '', slug: '', image: '', description: '' }); }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="table-responsive card border-0 shadow-sm p-3">
        <table className="table table-hover align-middle text-center">
          <thead className="table-dark">
            <tr>
              <th>Icon</th>
              <th>Name</th>
              <th>Slug</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c._id}>
                <td className="fs-3">{c.image || '📦'}</td>
                <td className="fw-semibold">{c.name}</td>
                <td className="text-muted">{c.slug}</td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => startEdit(c)}>
                    <FiEdit2 />
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c._id)}>
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCategories;
