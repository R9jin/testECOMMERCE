import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/ProductCard.module.css";

import cartIcon from "../assets/cart.png";
import heartIcon from "../assets/heart.png";
import starIcon from "../assets/star.png";

import { useAuth } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  const { wishlistItems, toggleWishlist } = useContext(WishlistContext);
  const { isLoggedIn } = useAuth();

  const fullStars = Math.round(product.rating);
  const [showNotice, setShowNotice] = useState(false);

  // Safely handle wishlist checking (convert both to strings)
  const isWishlisted = wishlistItems.includes(String(product.product_id));

  // ✅ Helper to handle image URLs (local assets vs uploaded storage)
  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url; // It's an uploaded image
    return process.env.PUBLIC_URL + url;    // It's a local asset
  };

  const handleAddToCart = async () => {
      if (!isLoggedIn) {
          alert("Please log in first to add items to your cart.");
          return;
      }
      try {
        // ✅ FIX: Wait for success response
        const success = await addToCart({ ...product, quantity: 1 });
        
        if (success) {
          setShowNotice(true);
          setTimeout(() => setShowNotice(false), 3000);
        } else {
          alert("Could not add item to cart.");
        }
      } catch (err) {
        console.error("Failed to add to cart:", err);
        alert("Could not add item to cart. Try again.");
      }
    };

  const handleToggleWishlist = async () => {
    if (!isLoggedIn) {
        alert("Please log in first to manage your wishlist.");
        return;
    }
    // Pass product_id (string) as expected by WishlistContext logic
    await toggleWishlist(product.product_id); 
  };

  return (
    <div className={styles.productCard}>
      <div className={styles.productImage}>
        <Link to={`/product/${product.product_id}`}>
          <img src={getImageUrl(product.image_url)} alt={product.name} />
        </Link>
      </div>

      <div className={styles.productDetails}>
        <div className={styles.rating}>
          {[...Array(5)].map((_, i) => (
            <img
              key={i}
              src={starIcon}
              alt="star"
              className={`${styles.star} ${i < fullStars ? styles.filled : styles.unfilled}`}
            />
          ))}
        </div>

        <Link to={`/product/${product.product_id}`} className={styles.productName}>
          <h3>{product.name}</h3>
        </Link>

        <p className={styles.productPrice}>₱{Number(product.price).toFixed(2)}</p>

        <div className={styles.productFooter}>
          <span className={styles.sold}>{product.sold ? `${product.sold} Sold` : "0 Sold"}</span>
          <div className={styles.icons}>
            <img
              src={heartIcon}
              alt="wishlist"
              className={`${styles.wishIcon} ${isWishlisted ? styles.active : ""}`}
              onClick={handleToggleWishlist}
            />
            <img
              src={cartIcon}
              alt="cart"
              className={`${styles.cartIcon} ${showNotice ? styles.active : ""}`}
              onClick={handleAddToCart}
            />
          </div>
        </div>

        {showNotice && <div className={styles.cartNotice}>Added to cart!</div>}
      </div>
    </div>
  );
}

export default ProductCard;