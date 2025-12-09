import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WishlistCard from "../components/WishlistCard";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import styles from "../styles/WishlistPage.module.css";

export default function WishListPage() {
  const { addToCart } = useContext(CartContext);
  // wishlistItems is now an array of strings like ['AP001', 'MC002']
  const { wishlistItems, removeFromWishlist } = useContext(WishlistContext);
  const [allProducts, setAllProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch all products so we can filter them locally against the wishlist IDs
        const res = await fetch("http://127.0.0.1:8000/api/products");
        const data = await res.json();
        // Check if data.data exists (Laravel resource response) or just data
        setAllProducts(data.data || data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setAllProducts([]);
      }
    };
    fetchProducts();
  }, []);

  // ✅ FIX: Use .includes() because wishlistItems is an array of IDs (strings)
  const wishlistProducts = allProducts.filter(p =>
    wishlistItems.includes(String(p.product_id))
  );

  const handleAddCart = (product) => {
    addToCart({ ...product, quantity: 1 });
  };

  const handleBuyNow = (product) => {
    addToCart({ ...product, quantity: 1 });
    navigate("/checkout");
  };

  return (
    <main className={styles.wishlistPage}>
      <h2>Your Wishlist</h2>
      <div className={styles.wishlistList}>
        {wishlistProducts.length === 0 ? (
          <p className={styles.emptyMsg}>No wishlisted items yet.</p>
        ) : (
          wishlistProducts.map((product) => (
            <WishlistCard
              key={product.product_id}
              product={product}
              onRemove={() => removeFromWishlist(product.product_id)}
              onAddCart={() => handleAddCart(product)}
              onBuyNow={() => handleBuyNow(product)}
            />
          ))
        )}
      </div>
    </main>
  );
}