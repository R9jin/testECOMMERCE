import styles from "../styles/WishlistCard.module.css";

/**
 * WishlistCard Component
 *
 * Displays a single product in the user's wishlist, showing its image, details,
 * price, and action buttons for adding to cart, buying immediately, or removing.
 */
function WishlistCard({ product, onRemove, onAddCart, onBuyNow }) {
  const imageSrc = product.image_url?.startsWith("http")
    ? product.image_url
    : process.env.PUBLIC_URL + product.image_url;

  return (
    <div className={styles.wishlistCard}>
      {/* Product image */}
      <div className={styles.wishlistImage}>
        <img src={imageSrc} alt={product.name} />
      </div>

      {/* Product details */}
      <div className={styles.wishlistDetails}>
        <p><strong>{product.name}</strong></p>
        <p>{product.description}</p>
        <p>{product.sold ?? 0} sold</p>
      </div>

      {/* Product price */}
      <div className={styles.wishlistPrice}>₱{product.price}</div>

      {/* Action buttons */}
      <div className={styles.wishlistActions}>
        <button className={styles.addCart} onClick={() => onAddCart(product)}>
          Add to Cart
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
