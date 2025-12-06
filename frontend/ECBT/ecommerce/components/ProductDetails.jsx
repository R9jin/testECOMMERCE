import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import cartIcon from "../assets/cart.png";
import heartIcon from "../assets/heart.png";
import starIcon from "../assets/star.png";
import { useAuth } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import styles from "../styles/ProductDetails.module.css";

function ProductDetails({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [showNotice, setShowNotice] = useState(false);
  const { addToCart } = useContext(CartContext);
  const { wishlistItems, toggleWishlist } = useContext(WishlistContext);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // ✅ FIX 1: Use product.product_id to match the items in wishlistItems context
  const isWishlisted = wishlistItems.includes(product.product_id);
  
  const fullStars = Math.round(product.rating);

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      alert("Please log in first to add items to your cart.");
      return;
    }

    try {
      await addToCart({ ...product, quantity });
      setShowNotice(true);
      setTimeout(() => setShowNotice(false), 1500);
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert("Could not add item to cart. Try again.");
    }
  };

  const handleBuyNow = async () => {
    if (!isLoggedIn) {
      alert("Please log in first to proceed to checkout.");
      return;
    }

    try {
      await addToCart({ ...product, quantity });
      navigate("/checkout");
    } catch (err) {
      console.error("Failed to proceed to checkout:", err);
      alert("Could not proceed to checkout. Try again.");
    }
  };

  const handleToggleWishlist = async () => {
    if (!isLoggedIn) {
      alert("Please log in first to manage your wishlist.");
      return;
    }

    try {
      await toggleWishlist(product.product_id);
    } catch (err) {
      console.error("Failed to update wishlist:", err);
      alert("Could not update wishlist. Try again.");
    }
  };

  if (!product) return <p>Loading product details...</p>;

  return (
    <div className={styles.productDetailsPage}>
      <div className={styles.imageGallery}>
        <div className={styles.thumbnails}>
          {[product.image, product.image, product.image].map((img, i) => (
            <img key={i} src={img} alt="thumb" className={styles.thumb} />
          ))}
        </div>
        <div className={styles.mainImage}>
          <img src={product.image} alt={product.name} />
        </div>
      </div>

      <div className={styles.detailsSection}>
        <h2>{product.name}</h2>
        
        {/* ✅ FIX 2: Convert string price to Number before .toFixed() */}
        <p className={styles.price}>₱{Number(product.price).toFixed(2)}</p>

        <div className={styles.rating}>
          {[...Array(5)].map((_, i) => (
            <img
              key={i}
              src={starIcon}
              alt="star"
              className={`${styles.star} ${i < fullStars ? styles.filled : ""}`}
            />
          ))}
          <span className={styles.reviewCount}>(32 reviews)</span>
        </div>

        <p className={styles.description}>{product.description}</p>

        <ul className={styles.features}>
          <li>Lorem ipsum dolor sit amet</li>
          <li>Consectetur adipiscing elit</li>
          <li>Sed do eiusmod tempor incididunt</li>
        </ul>

        <div className={styles.actions}>
          <div className={styles.productDetailQuantity}>
            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity((q) => q + 1)}>+</button>
          </div>

          <button
            className={styles.productDetailAddCart}
            onClick={handleAddToCart}
          >
            <img src={cartIcon} alt="cart" /> Add to Cart
          </button>
        </div>

        {showNotice && <div className={styles.cartNotice}>Added to cart!</div>}

        <button
          className={styles.productDetailBuyNow}
          onClick={handleBuyNow}
        >
          Buy Now
        </button>

        <div className={styles.extraInfo}>
          <p>Free shipping on orders over ₱100</p>
          <p>Delivery in 3–7 working days</p>
        </div>

        <img
          src={heartIcon}
          alt="wishlist"
          className={`${styles.wishlistIcon} ${isWishlisted ? styles.active : ""}`}
          onClick={handleToggleWishlist}
        />
      </div>
    </div>
  );
}

export default ProductDetails;