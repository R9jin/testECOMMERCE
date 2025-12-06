import { createContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

export const OrderHistoryContext = createContext();

export const OrderHistoryProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
    fetch(`http://127.0.0.1:8000/api/orders`, {
      headers: { Authorization: `Bearer ${currentUser.token}` }
    })
      .then(res => res.json())
      .then(data => setTransactions(data))
      .catch(() => setTransactions([]));
  }, [currentUser]);

  const addTransaction = async (newTransaction) => {
    if (!currentUser) return;
    const res = await fetch(`http://127.0.0.1:8000/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.token}`
      },
      body: JSON.stringify(newTransaction)
    });
    const savedTransaction = await res.json();
    setTransactions(prev => [...prev, savedTransaction]);
  };

  const clearTransactions = async () => {
    if (!currentUser) return;
    await fetch(`http://127.0.0.1:8000/api/orders/clear`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${currentUser.token}` }
    });
    setTransactions([]);
  };

  return (
    <OrderHistoryContext.Provider value={{ transactions, addTransaction, clearTransactions }}>
      {children}
    </OrderHistoryContext.Provider>
  );
};
