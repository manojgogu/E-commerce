import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { FiUsers, FiPackage, FiShoppingBag, FiDollarSign } from 'react-icons/fi';

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/stats').then(({ data }) => setStats(data));
  }, []);

  const cards = stats ? [
    { icon: <FiUsers size={32} />, label: 'Total Users', value: stats.totalUsers, color: 'primary' },
    { icon: <FiPackage size={32} />, label: 'Products', value: stats.totalProducts, color: 'success' },
    { icon: <FiShoppingBag size={32} />, label: 'Orders', value: stats.totalOrders, color: 'warning' },
    { icon: <FiDollarSign size={32} />, label: 'Revenue', value: `₹${stats.totalRevenue?.toLocaleString()}`, color: 'danger' },
  ] : [];

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">🛡️ Admin Dashboard</h2>
      </div>
      <div className="row g-4 mb-5">
        {cards.map((c, i) => (
          <div className="col-sm-6 col-xl-3" key={i}>
            <div className={`card border-0 shadow-sm border-start border-${c.color} border-4`}>
              <div className="card-body d-flex align-items-center gap-3 p-4">
                <div className={`text-${c.color}`}>{c.icon}</div>
                <div>
                  <div className="text-muted small">{c.label}</div>
                  <div className="fs-4 fw-bold">{c.value ?? '–'}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="row g-3">
        {[
          { to: '/admin/products', emoji: '📦', label: 'Manage Products' },
          { to: '/admin/orders', emoji: '🛍️', label: 'Manage Orders' },
          { to: '/admin/users', emoji: '👥', label: 'Manage Users' },
          { to: '/admin/categories', emoji: '📂', label: 'Manage Categories' },
        ].map((item) => (
          <div className="col-md-4" key={item.to}>
            <Link to={item.to} className="card border-0 shadow-sm text-decoration-none text-dark text-center p-4 h-100">
              <div className="fs-1">{item.emoji}</div>
              <div className="fw-semibold mt-2">{item.label}</div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
