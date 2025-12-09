import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WishlistCard from "../components/WishlistCard";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import styles from "../styles/WishlistPage.module.css";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export default function WishListPage() {
  const { addToCart } = useContext(CartContext);
  const { wishlistItems, removeFromWishlist } = useContext(WishlistContext);
  const [allProducts, setAllProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch all products to match against wishlist IDs
        const res = await fetch(`${API_BASE_URL}/products`);
        const data = await res.json();
        setAllProducts(data.data || data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setAllProducts([]);
      }
    };
    fetchProducts();
  }, []);

  const wishlistProducts = allProducts.filter(p =>
    wishlistItems.includes(String(p.product_id))
  );

  // ✅ Updated to be async and return the result
  const handleAddCart = async (product) => {
    return await addToCart({ ...product, quantity: 1 });
  };

  // ✅ Updated to wait for cart addition before navigating
  const handleBuyNow = async (product) => {
    const success = await addToCart({ ...product, quantity: 1 });
    if (success) {
      navigate("/checkout");
    } else {
      alert("Failed to add item to cart.");
    }
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
              onAddCart={() => handleAddCart(product)} // Pass async function
              onBuyNow={() => handleBuyNow(product)}
            />
          ))
        )}
      </div>
    </main>
  );
}