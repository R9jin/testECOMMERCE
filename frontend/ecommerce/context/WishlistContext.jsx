import { createContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  // ✅ FIX: Destructure token
  const { token } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]); 
  const API_BASE_URL = "http://127.0.0.1:8000/api";

  useEffect(() => {
    if (!token) {
        setWishlistItems([]);
        return;
    }

    const fetchWishlist = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/wishlist`, {
          headers: { Authorization: `Bearer ${token}` }, // ✅ Use token
        });
        if (!res.ok) throw new Error("Failed to fetch wishlist");

        const data = await res.json();
        // Ensure we store string IDs to match product IDs
        setWishlistItems(data.map(item => String(item.product_id)));
      } catch (err) {
        console.error("Wishlist fetch error:", err);
        setWishlistItems([]);
      }
    };

    fetchWishlist();
  }, [token]); // ✅ Depend on token

  const addToWishlist = async (productId) => {
    if (!token) return false;
    const id = String(productId);

    setWishlistItems(prev => [...prev, id]);

    try {
      const res = await fetch(`${API_BASE_URL}/wishlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Use token
        },
        body: JSON.stringify({ product_id: id }),
      });

      if (res.status === 409) return true;
      if (!res.ok) throw new Error("Failed to add to wishlist");
      return true;
    } catch (err) {
      console.error("Add wishlist error:", err);
      setWishlistItems(prev => prev.filter(pid => pid !== id));
      return false;
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!token) return false;
    const id = String(productId);

    // 1. Optimistic Update: Remove from UI immediately
    setWishlistItems(prev => prev.filter(pid => pid !== id));

    try {
      // 2. Call the new endpoint directly using the PRODUCT ID
      const res = await fetch(`${API_BASE_URL}/wishlist/product/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) throw new Error("Failed to remove");
      return true;
    } catch (err) {
      console.error("Remove wishlist error:", err);
      // 3. Revert change if it failed
      setWishlistItems(prev => [...prev, id]);
      return false;
    }
  };

  const toggleWishlist = async (productId) => {
    const id = String(productId);
    return wishlistItems.includes(id)
      ? await removeFromWishlist(id)
      : await addToWishlist(id);
  };

  return (
    <WishlistContext.Provider
      value={{ wishlistItems, addToWishlist, removeFromWishlist, toggleWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};