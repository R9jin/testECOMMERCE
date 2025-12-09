import { useState } from "react";
import styles from "../styles/WishlistCard.module.css";

function WishlistCard({ product, onRemove, onAddCart, onBuyNow }) {
  // 1. Add state for visual feedback
  const [isAdded, setIsAdded] = useState(false);

  const imageSrc = product.image_url?.startsWith("http")
    ? product.image_url
    : process.env.PUBLIC_URL + product.image_url;

  // 2. Handle click: call parent function + show feedback
  const handleAddToCart = () => {
    onAddCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000); // Revert after 2 seconds
  };

  return (
    <div className={styles.wishlistCard}>
      <div className={styles.wishlistImage}>
        <img src={imageSrc} alt={product.name} />
      </div>

      <div className={styles.wishlistDetails}>
        <p><strong>{product.name}</strong></p>
        <p>{product.description}</p>
        <p>{product.sold ?? 0} sold</p>
      </div>

      <div className={styles.wishlistPrice}>₱{product.price}</div>

      <div className={styles.wishlistActions}>
        {/* 3. Update Button with conditional styling and text */}
        <button 
          className={`${styles.addCart} ${isAdded ? styles.added : ""}`} 
          onClick={handleAddToCart}
          disabled={isAdded}
        >
          {isAdded ? "Added!" : "Add to Cart"}
        </button>

        <button className={styles.buyNow} onClick={() => onBuyNow(product)}>
          Buy Now
        </button>

        <button className={styles.removeWishlist} onClick={() => onRemove(product)}>
          Remove
        </button>
      </div>
    </div>
  );
}

export default WishlistCard;