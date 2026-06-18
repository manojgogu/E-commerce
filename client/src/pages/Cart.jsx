import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';

const Cart = () => {
  const { cart, updateItem, removeItem, cartTotal } = useCart();

  if (!cart.items?.length) return (
    <div className="container py-5 text-center">
      <div className="fs-1 mb-3">🛒</div>
      <h4 className="text-muted">Your cart is empty</h4>
      <Link to="/products" className="btn btn-warning mt-3">Start Shopping</Link>
    </div>
  );

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Shopping Cart</h2>
      <div className="row g-4">
        <div className="col-lg-8">
          {cart.items.map((item) => (
            <div key={item.product?._id || item._id} className="card border-0 shadow-sm mb-3 p-3">
              <div className="row align-items-center g-3">
                <div className="col-3 col-md-2">
                  <img src={item.product?.images?.[0] || 'https://via.placeholder.com/80'}
                    className="img-fluid rounded" alt={item.product?.name} />
                </div>
                <div className="col-9 col-md-5">
                  <h6 className="fw-semibold mb-1">{item.product?.name}</h6>
                  <p className="text-muted mb-0 small">₹{item.price?.toLocaleString()} each</p>
                </div>
                <div className="col-md-3 d-flex align-items-center gap-2">
                  <button className="btn btn-sm btn-outline-dark"
                    onClick={() => updateItem(item.product?._id, item.quantity - 1)}><FiMinus /></button>
                  <span className="fw-semibold px-2">{item.quantity}</span>
                  <button className="btn btn-sm btn-outline-dark"
                    onClick={() => updateItem(item.product?._id, item.quantity + 1)}><FiPlus /></button>
                </div>
                <div className="col-md-2 d-flex align-items-center justify-content-between">
                  <span className="fw-bold">₹{(item.price * item.quantity).toLocaleString()}</span>
                  <button className="btn btn-sm btn-outline-danger ms-2"
                    onClick={() => removeItem(item.product?._id)}><FiTrash2 /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="col-lg-4">
          <div className="card border-0 shadow p-4">
            <h5 className="fw-bold mb-4">Order Summary</h5>
            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal</span><span>₹{cartTotal.toLocaleString()}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Shipping</span>
              <span className="text-success">{cartTotal >= 500 ? 'FREE' : '₹49'}</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between fw-bold fs-5 mb-4">
              <span>Total</span>
              <span>₹{(cartTotal < 500 ? cartTotal + 49 : cartTotal).toLocaleString()}</span>
            </div>
            <Link to="/checkout" className="btn btn-warning w-100 fw-semibold">
              Proceed to Checkout →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
