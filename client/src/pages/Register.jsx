import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm)
      return toast.error("Passwords don't match");
    setLoading(true);
    try {
      const user = await register(form.name, form.email, form.password);
      toast.success(`Welcome, ${user.name}! Account created.`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f3460)' }}>
      <div className="card shadow-lg border-0 rounded-4" style={{ width: '440px' }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <span className="fs-1">🛒</span>
            <h2 className="fw-bold">Create Account</h2>
            <p className="text-muted">Join ShopEZ today</p>
          </div>
          <form onSubmit={handleSubmit}>
            {[
              { label: 'Full Name', key: 'name', type: 'text', placeholder: 'John Doe' },
              { label: 'Email', key: 'email', type: 'email', placeholder: 'you@example.com' },
              { label: 'Password', key: 'password', type: 'password', placeholder: 'Min 6 characters' },
              { label: 'Confirm Password', key: 'confirm', type: 'password', placeholder: 'Repeat password' },
            ].map(({ label, key, type, placeholder }) => (
              <div className="mb-3" key={key}>
                <label className="form-label fw-semibold">{label}</label>
                <input type={type} className="form-control" required placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
              </div>
            ))}
            <button type="submit" className="btn btn-warning w-100 fw-semibold mt-2" disabled={loading}>
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center mt-3 mb-0">
            Already have an account? <Link to="/login" className="text-warning fw-semibold">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
