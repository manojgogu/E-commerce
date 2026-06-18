import { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import { toast } from 'react-toastify';

const statusColors = { processing: 'warning', shipped: 'info', delivered: 'success', cancelled: 'danger' };

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders').then(({ data }) => setOrders(data));
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { orderStatus: status });
    toast.success('Order status updated');
    api.get('/orders').then(({ data }) => setOrders(data));
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">🛍️ Manage Orders ({orders.length})</h2>
      <div className="table-responsive card border-0 shadow-sm p-3">
        <table className="table table-hover align-middle">
          <thead className="table-dark">
            <tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th><th>Action</th></tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td><small className="text-muted">{o._id.slice(-8)}</small></td>
                <td>{o.user?.name}<br /><small className="text-muted">{o.user?.email}</small></td>
                <td className="fw-semibold">₹{o.totalPrice?.toLocaleString()}</td>
                <td><span className={`badge ${o.paymentStatus === 'paid' ? 'bg-success' : 'bg-secondary'}`}>{o.paymentStatus}</span></td>
                <td>
                  <span className={`badge bg-${statusColors[o.orderStatus] || 'secondary'}`}>{o.orderStatus}</span>
                </td>
                <td><small>{new Date(o.createdAt).toLocaleDateString('en-IN')}</small></td>
                <td>
                  <select className="form-select form-select-sm" style={{ minWidth: 130 }}
                    value={o.orderStatus} onChange={(e) => updateStatus(o._id, e.target.value)}>
                    {['processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageOrders;
