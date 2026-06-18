import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) return setCart({ items: [] });
    try {
      const { data } = await api.get('/cart');
      setCart(data);
    } catch (e) {}
  };

  useEffect(() => { fetchCart(); }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      setLoading(true);
      const { data } = await api.post('/cart', { productId, quantity });
      setCart(data);
      toast.success('Added to cart!');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Error adding to cart');
    } finally { setLoading(false); }
  };

  const updateItem = async (productId, quantity) => {
    const { data } = await api.put(`/cart/${productId}`, { quantity });
    setCart(data);
  };

  const removeItem = async (productId) => {
    const { data } = await api.delete(`/cart/${productId}`);
    setCart(data);
    toast.info('Item removed from cart');
  };

  const clearCart = async () => {
    await api.delete('/cart');
    setCart({ items: [] });
  };

  const cartCount = cart.items?.reduce((acc, i) => acc + i.quantity, 0) || 0;
  const cartTotal = cart.items?.reduce((acc, i) => acc + i.price * i.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, addToCart, updateItem, removeItem, clearCart, cartCount, cartTotal, loading, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
