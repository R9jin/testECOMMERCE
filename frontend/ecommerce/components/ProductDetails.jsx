import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getReviews } from "../api/reviews";
import heartIcon from "../assets/heart.png";
import starIcon from "../assets/star.png";
import { useAuth } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import styles from "../styles/ProductDetails.module.css";

function ProductDetails({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [showNotice, setShowNotice] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(product.rating);

  const { addToCart } = useContext(CartContext);
  const { wishlistItems, toggleWishlist } = useContext(WishlistContext);
  const { isLoggedIn } = useAuth();
  
  // ✅ FIX: navigate was unused; now used for redirection
  const navigate = useNavigate();

  const isWishlisted = wishlistItems.includes(String(product.product_id));

  // Fetch reviews when component loads
  useEffect(() => {
    if (product?.id) {
      getReviews(product.id)
        .then((res) => {
          if (res.success) {
            setReviews(res.data);
            if (res.data.length > 0) {
              const total = res.data.reduce((acc, r) => acc + r.rating, 0);
              setAverageRating((total / res.data.length).toFixed(1));
            }
          }
        })
        .catch(err => console.error("Failed to load reviews", err));
    }
  }, [product]);

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      // ✅ FIX: Use navigate instead of just alert
      if(window.confirm("Please log in first to add items to your cart.")) {
        navigate("/login");
      }
      return;
    }

    setIsAdding(true);

    try {
      const success = await addToCart({ ...product, quantity });
      
      if (success) {
        setShowNotice(true);
        setTimeout(() => setShowNotice(false), 2000);
      } else {
        alert("Failed to add item to cart.");
      }
    } catch (error) {
      console.error("Cart Error:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!isLoggedIn) {
        // ✅ FIX: Use navigate instead of just alert
        if(window.confirm("Please log in first.")) {
            navigate("/login");
        }
        return;
    }
    await toggleWishlist(product.product_id);
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className={styles.productDetailsPage}>
      <div className={styles.imageGallery}>
        <div className={styles.mainImage}>
          <img src={product.image} alt={product.name} />
        </div>
      </div>

      <div className={styles.detailsSection}>
        <h2>{product.name}</h2>
        <p className={styles.price}>₱{Number(product.price).toFixed(2)}</p>

        <div className={styles.rating}>
          {[...Array(5)].map((_, i) => (
            <img
              key={i}
              src={starIcon}
              className={`${styles.star} ${i < Math.round(averageRating) ? styles.filled : ""}`}
              alt="star"
            />
          ))}
          <span className={styles.reviewCount}>({reviews.length} reviews)</span>
        </div>

        <p className={styles.description}>{product.description}</p>
        
        <div className={styles.actions}>
            {/* ✅ FIX: Added Quantity Selector using setQuantity */}
            <div className={styles.productDetailQuantity}>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)}>+</button>
            </div>

            {/* ✅ FIX: Used isAdding to provide loading feedback */}
            <button 
                className={styles.productDetailAddCart} 
                onClick={handleAddToCart}
                disabled={isAdding}
                style={{ opacity: isAdding ? 0.7 : 1, cursor: isAdding ? 'not-allowed' : 'pointer' }}
            >
              {isAdding ? "Adding..." : "Add to Cart"}
            </button>
        </div>
        {showNotice && <div className={styles.cartNotice}>Added to cart!</div>}

        <img
          src={heartIcon}
          className={`${styles.wishlistIcon} ${isWishlisted ? styles.active : ""}`}
          onClick={handleToggleWishlist}
          alt="wishlist"
        />
        <div style={{ marginTop: "40px", borderTop: "1px solid #ddd", paddingTop: "20px" }}>
          <h3>Customer Reviews</h3>
          {reviews.length === 0 ? (
            <p style={{ color: "#777" }}>No reviews yet.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {reviews.map((rev) => (
                <li key={rev.id} style={{ marginBottom: "15px", borderBottom: "1px solid #f0f0f0", paddingBottom: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <strong>{rev.user?.name || "Anonymous"}</strong>
                    <span style={{ color: "#ff4b2b", fontWeight: "bold" }}>
                      {rev.rating} ★
                    </span>
                  </div>
                  <p style={{ margin: "5px 0", color: "#555" }}>{rev.comment}</p>
                  <small style={{ color: "#999" }}>
                    {new Date(rev.created_at).toLocaleDateString()}
                  </small>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}

export default ProductDetails;