import { useLocation, Link } from 'react-router-dom';

const OrderSuccess = () => {
  const { state } = useLocation();
  const order = state?.order;

  return (
    <div className="container py-5 text-center">
      <div className="fs-1 mb-3">🎉</div>
      <h2 className="fw-bold text-success">Order Placed Successfully!</h2>
      {order && (
        <div className="card border-0 shadow-sm d-inline-block mt-4 p-4 text-start" style={{ minWidth: 320 }}>
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Total:</strong> ₹{order.totalPrice?.toLocaleString()}</p>
          <p><strong>Payment:</strong> {order.paymentMethod}</p>
          <p><strong>Status:</strong>
            <span className="badge bg-warning text-dark ms-2">{order.orderStatus}</span>
          </p>
          <p><strong>Address:</strong> {order.shippingAddress?.street}, {order.shippingAddress?.city}</p>
        </div>
      )}
      <div className="mt-4 d-flex gap-3 justify-content-center">
        <Link to="/orders" className="btn btn-warning">View My Orders</Link>
        <Link to="/products" className="btn btn-outline-dark">Continue Shopping</Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
