import { useEffect, useState } from 'react';
import api from '../api/axiosInstance';

const statusColors = {
  processing: 'warning', shipped: 'info', delivered: 'success', cancelled: 'danger',
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders/my').then(({ data }) => setOrders(data));
  }, []);

  if (!orders.length) return (
    <div className="container py-5 text-center">
      <div className="fs-1 mb-3">📦</div>
      <h4 className="text-muted">No orders yet</h4>
    </div>
  );

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">My Orders</h2>
      {orders.map((order) => (
        <div className="card border-0 shadow-sm mb-4" key={order._id}>
          <div className="card-header d-flex justify-content-between align-items-center bg-white">
            <div>
              <small className="text-muted">Order ID: </small>
              <strong className="text-dark">{order._id}</strong>
            </div>
            <div className="d-flex gap-3 align-items-center">
              <small>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</small>
              <span className={`badge bg-${statusColors[order.orderStatus] || 'secondary'}`}>
                {order.orderStatus}
              </span>
            </div>
          </div>
          <div className="card-body">
            {order.items.map((item, i) => (
              <div className="d-flex align-items-center gap-3 mb-2" key={i}>
                <img src={item.image || 'https://via.placeholder.com/60'}
                  style={{ width: 60, height: 60, objectFit: 'cover' }} className="rounded" alt={item.name} />
                <div>
                  <div className="fw-semibold">{item.name}</div>
                  <small className="text-muted">Qty: {item.quantity} × ₹{item.price?.toLocaleString()}</small>
                </div>
              </div>
            ))}
          </div>
          <div className="card-footer bg-white d-flex justify-content-between">
            <span className="text-muted">Total: <strong>₹{order.totalPrice?.toLocaleString()}</strong></span>
            <span className="text-muted">Payment: {order.paymentMethod} — <span className={`text-${order.paymentStatus === 'paid' ? 'success' : 'warning'}`}>{order.paymentStatus}</span></span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
