import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./authconetxt"; 

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { authToken } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    if (authToken) fetchCart();
  }, [authToken]);

  
  const fetchCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("https://localhost:3001/cart/get", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setCart(res.data?.items || []);
    } catch (err) {
      setError("Failed to load cart.");
    } finally {
      setLoading(false);
    }
  };

  // Add to cart
  const addToCart = async (jewelryId, quantity = 1) => {
    try {
      const res = await axios.post(
        "https://localhost:3001/cart/add",
        { jewelryId, quantity },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setCart(res.data?.items || []);
    } catch (err) {
      console.error("Add to cart failed", err);
      setError("Failed to add item to cart.");
    }
  };

  // Remove from cart
  const removeFromCart = async (jewelryId) => {
    try {
      const res = await axios.delete("https://localhost:3001/cart/remove", {
        headers: { Authorization: `Bearer ${authToken}` },
        data: { jewelryId },
      });
      setCart(res.data?.items || []);
    } catch (err) {
      console.error("Remove from cart failed", err);
      setError("Failed to remove item from cart.");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        addToCart,
        removeFromCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
