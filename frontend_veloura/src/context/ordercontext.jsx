import axios from "axios";
import { createContext, useContext, useState, useEffect,useCallback  } from "react";
import { useAuth } from "./authconetxt";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const { authToken } = useAuth();
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all user orders
  const fetchOrders = async () => {
    if (!authToken) return;
     
    setError(null);
    try {
      const res = await axios.get("http://localhost:3001/order/user", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setOrders(res.data || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };



  // Create new order
  const createOrder = async (orderData) => {
    try {
      const res = await axios.post("http://localhost:3001/order/create", orderData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setCurrentOrder(res.data);
      fetchOrders(); 
      return res.data;
    } catch (err) {
      console.error("Create order failed:", err);
      setError("Failed to create order.");
      throw err;
    }
  };

  // Cancel an order
  const cancelOrder = async (orderNumber) => {
    try {
      await axios.put(`http://localhost:3001/order/cancel/${orderNumber}`, {}, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      fetchOrders();
    } catch (err) {
      console.error("Cancel order failed:", err);
      setError("Failed to cancel order.");
    }
  };

  // Get single order by orderNumber
  const getOrderDetails = async (orderNumber) => {
    try {
      const res = await axios.get(`http://localhost:3001/order/${orderNumber}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setCurrentOrder(res.data);
    } catch (err) {
      console.error("Get order failed:", err);
      setError("Failed to fetch order.");
    }
  };

    useEffect(() => {
    fetchOrders();
  }, [authToken]);

  return (
    <OrderContext.Provider
      value={{
        orders,
        currentOrder,
        loading,
        error,
        fetchOrders,
        createOrder,
        cancelOrder,
        getOrderDetails,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);
