import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';
import { toast } from 'react-toastify';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
    country: 'India',
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);

  const shipping = cartTotal >= 500 ? 0 : 49;
  const total = cartTotal + shipping;

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!cart.items?.length) return toast.error('Cart is empty');
    setLoading(true);
    try {
      const items = cart.items.map((i) => ({
        product: i.product?._id, name: i.product?.name,
        image: i.product?.images?.[0], price: i.price, quantity: i.quantity,
      }));

      if (paymentMethod === 'Online') {
        // Mock payment simulation
        const confirm = window.confirm('Proceed to Demo Payment Interface?');
        if (!confirm) {
          setLoading(false);
          return;
        }
        toast.info('Processing online payment...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      const { data } = await api.post('/orders', {
        items,
        shippingAddress: address,
        paymentMethod,
        totalPrice: total,
        paymentStatus: paymentMethod === 'Online' ? 'paid' : 'pending'
      });

      await clearCart();
      toast.success('Order placed successfully!');
      navigate('/order-success', { state: { order: data } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally { setLoading(false); }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-xl-10">
          <h2 className="fw-bold mb-4 d-flex align-items-center gap-3">
            <span className="bg-warning text-dark px-3 py-1 rounded-3 fs-4">Checkout</span>
            <span className="fs-6 text-muted fw-normal">Complete your secure order</span>
          </h2>
          <div className="row g-4">
            <div className="col-lg-7">
              <div className="card border-0 shadow-sm overflow-hidden mb-4 rounded-4">
                <div className="bg-dark text-white p-3 px-4 d-flex align-items-center gap-2">
                  <span className="bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center" style={{ width: 24, height: 24, fontSize: 12 }}>1</span>
                  <h6 className="mb-0 fw-semibold">Shipping Address</h6>
                </div>
                <div className="p-4">
                  <form id="checkoutForm" onSubmit={handleOrder}>
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label small fw-bold text-muted text-uppercase ls-1">Street Address</label>
                        <input className="form-control form-control-lg bg-light border-0" placeholder="123, MG Road" required
                          value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted text-uppercase ls-1">City</label>
                        <input className="form-control form-control-lg bg-light border-0" placeholder="Bangalore" required
                          value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted text-uppercase ls-1">State</label>
                        <input className="form-control form-control-lg bg-light border-0" placeholder="Karnataka" required
                          value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-muted text-uppercase ls-1">Pincode</label>
                        <input className="form-control form-control-lg bg-light border-0" placeholder="560001" required
                          value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} />
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              <div className="card border-0 shadow-sm overflow-hidden rounded-4">
                <div className="bg-dark text-white p-3 px-4 d-flex align-items-center gap-2">
                  <span className="bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center" style={{ width: 24, height: 24, fontSize: 12 }}>2</span>
                  <h6 className="mb-0 fw-semibold">Payment Method</h6>
                </div>
                <div className="p-4">
                  <div className="row g-3">
                    {[{ id: 'COD', label: 'Cash on Delivery', sub: 'Pay when you receive', icon: '💵' },
                      { id: 'Online', label: 'Online Payment', sub: 'UPI, Cards, Netbanking', icon: '💳' }
                    ].map((m) => (
                      <div className="col-md-6" key={m.id}>
                        <div
                          className={`p-3 rounded-4 border-2 cursor-pointer transition-all ${paymentMethod === m.id ? 'border-warning bg-warning bg-opacity-10' : 'border-light bg-light'}`}
                          style={{ cursor: 'pointer', border: '2px solid' }}
                          onClick={() => setPaymentMethod(m.id)}
                        >
                          <div className="d-flex align-items-center gap-3">
                            <div className="fs-3">{m.icon}</div>
                            <div>
                              <div className="fw-bold">{m.label}</div>
                              <div className="small text-muted">{m.sub}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="card border-0 shadow-lg p-4 rounded-4 sticky-top" style={{ top: '2rem' }}>
                <h5 className="fw-bold mb-4">Order Summary</h5>
                <div className="mb-4" style={{ maxHeight: 200, overflowY: 'auto' }}>
                  {cart.items?.map((item, i) => (
                    <div key={i} className="d-flex justify-content-between mb-3 small align-items-center">
                      <div className="d-flex align-items-center gap-2">
                        <img src={item.product?.images?.[0]} style={{ width: 40, height: 40, objectFit: 'cover' }} className="rounded-2" alt="" />
                        <span className="text-truncate" style={{ maxWidth: 150 }}>{item.product?.name} <br /><span className="text-muted">qty: {item.quantity}</span></span>
                      </div>
                      <span className="fw-semibold">₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-light p-3 rounded-3 mb-4">
                  <div className="d-flex justify-content-between mb-2 small text-muted">
                    <span>Subtotal</span><span>₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2 small text-muted">
                    <span>Shipping Fee</span><span className={shipping === 0 ? 'text-success' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                  </div>
                  <div className="d-flex justify-content-between fw-bold fs-5 mt-2 pt-2 border-top">
                    <span>Total Amount</span><span className="text-warning">₹{total.toLocaleString()}</span>
                  </div>
                </div>
                <button type="submit" form="checkoutForm" className="btn btn-dark btn-lg w-100 rounded-pill py-3 fw-bold shadow-sm" disabled={loading}>
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : '🛍️ Complete Purchase'}
                </button>
                <div className="text-center mt-3">
                  <small className="text-muted d-flex align-items-center justify-content-center gap-1">
                    🔒 SSL Encrypted & Secure Checkout
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
