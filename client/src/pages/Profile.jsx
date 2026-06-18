import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, login } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '', phone: user?.phone || '', password: '',
    street: user?.address?.street || '', city: user?.address?.city || '',
    state: user?.address?.state || '', pincode: user?.address?.pincode || '',
  });

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.put('/auth/profile', {
        name: form.name, phone: form.phone,
        address: { street: form.street, city: form.city, state: form.state, pincode: form.pincode },
        ...(form.password && { password: form.password }),
      });
      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7">
          <div className="card border-0 shadow p-4">
            <div className="text-center mb-4">
              <div className="rounded-circle bg-warning d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: 80, height: 80 }}>
                <span className="fs-2 fw-bold">{user?.name?.charAt(0).toUpperCase()}</span>
              </div>
              <h4 className="fw-bold">{user?.name}</h4>
              <p className="text-muted">{user?.email}</p>
              {user?.role === 'admin' && <span className="badge bg-danger">Admin</span>}
            </div>
            <form onSubmit={handleSave}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Full Name</label>
                  <input className="form-control" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Phone</label>
                  <input className="form-control" value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold">Street</label>
                  <input className="form-control" value={form.street}
                    onChange={(e) => setForm({ ...form, street: e.target.value })} />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">City</label>
                  <input className="form-control" value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })} />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">State</label>
                  <input className="form-control" value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })} />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Pincode</label>
                  <input className="form-control" value={form.pincode}
                    onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold">New Password <small className="text-muted">(leave blank to keep)</small></label>
                  <input type="password" className="form-control" value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })} />
                </div>
              </div>
              <button type="submit" className="btn btn-warning w-100 fw-semibold mt-4">Save Changes</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
