import { createContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const API_BASE_URL = "http://127.0.0.1:8000/api";

  // Helper function to fetch and format cart data
  const fetchCart = async () => {
    if (!token) return;
    
    try {
      const res = await fetch(`${API_BASE_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      // Map backend structure { id, quantity, product: {...} } to frontend structure
      const formattedCart = Array.isArray(data) ? data.map(item => ({
        ...item.product,        // Spread product details
        cart_id: item.id,       // Keep cart ID for removal
        quantity: item.quantity, // ✅ FIX: Use actual quantity from DB
        image: item.product.image_url // Map image_url to image
      })) : [];

      setCartItems(formattedCart);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      setCartItems([]);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [token]);

  const addToCart = async (product) => {
    if (!token) return false; 

    try {
      // Use existing quantity if provided, else 1
      const qty = product.quantity || 1;

      const res = await fetch(`${API_BASE_URL}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        // Backend expects product_id and quantity
        body: JSON.stringify({ 
            product_id: product.id,
            quantity: qty 
        })
      });

      if (res.ok) {
        fetchCart(); 
        return true; // ✅ FIX: Return success
      } else {
        console.error("Failed to add to cart");
        return false;
      }
    } catch (err) {
      console.error("Add to cart error:", err);
      return false;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    // Optimistic update
    setCartItems(prev => prev.map(p => (p.id === productId ? { ...p, quantity } : p)));
    
    const item = cartItems.find(i => i.id === productId);
    if (!item) return;

    try {
        await fetch(`${API_BASE_URL}/cart/${item.cart_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ quantity })
        });
    } catch (err) {
        console.error("Failed to update quantity", err);
    }
  };

  const removeFromCart = async (productId) => {
    if (!token) return;

    const itemToRemove = cartItems.find(item => item.id === productId);
    if (!itemToRemove) return;

    try {
      await fetch(`${API_BASE_URL}/cart/${itemToRemove.cart_id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setCartItems(prev => prev.filter(p => p.id !== productId));
    } catch (err) {
      console.error("Remove cart error:", err);
    }
  };

  const clearCart = async () => {
    if (!token) return;
    try {
      await fetch(`${API_BASE_URL}/cart/clear`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems([]);
    } catch (err) {
      console.error("Clear cart error:", err);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};