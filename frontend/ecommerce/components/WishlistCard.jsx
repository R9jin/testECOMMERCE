import { useState } from "react";
import styles from "../styles/WishlistCard.module.css";

function WishlistCard({ product, onRemove, onAddCart, onBuyNow }) {
  const [isAdded, setIsAdded] = useState(false);
  const [isAdding, setIsAdding] = useState(false); // ✅ Track loading state

  const imageSrc = product.image_url?.startsWith("http")
    ? product.image_url
    : process.env.PUBLIC_URL + product.image_url;

  const handleAddToCart = async () => {
    setIsAdding(true);
    // ✅ Wait for the parent's API call to finish
    const success = await onAddCart(product);
    setIsAdding(false);

    if (success) {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000); // Revert after 2 seconds
    }
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

      <div className={styles.wishlistPrice}>₱{Number(product.price).toFixed(2)}</div>

      <div className={styles.wishlistActions}>
        <button 
          className={`${styles.addCart} ${isAdded ? styles.added : ""}`} 
          onClick={handleAddToCart}
          disabled={isAdded || isAdding} // ✅ Disable to prevent double clicks
          style={{ opacity: isAdding ? 0.7 : 1, cursor: (isAdded || isAdding) ? 'default' : 'pointer' }}
        >
          {isAdding ? "Adding..." : (isAdded ? "Added!" : "Add to Cart")}
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