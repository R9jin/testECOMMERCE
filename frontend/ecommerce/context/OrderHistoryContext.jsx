import { createContext, useEffect, useState } from "react";
import { getOrders } from "../api/orders";
import { useAuth } from "./AuthContext";

export const OrderHistoryContext = createContext();

export const OrderHistoryProvider = ({ children }) => {
  const { token } = useAuth(); 
  const [transactions, setTransactions] = useState([]);

  // Function to fetch latest data from Laravel
  const fetchOrders = async () => {
    if (!token) return;

    try {
      const response = await getOrders(token);
      if (response && response.success) {
        setTransactions(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  return (
    <OrderHistoryContext.Provider 
      value={{ 
        transactions, 
        refreshOrders: fetchOrders // ✅ Expose this to the app
      }}
    >
      {children}
    </OrderHistoryContext.Provider>
  );
};