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
  const [averageRating, setAverageRating] = useState(product.rating); // default to static rating

  const { addToCart } = useContext(CartContext);
  const { wishlistItems, toggleWishlist } = useContext(WishlistContext);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const isWishlisted = wishlistItems.includes(String(product.product_id));

  // Fetch reviews when component loads
  useEffect(() => {
    if (product?.id) {
      getReviews(product.id) // Use numeric ID for relation
        .then((res) => {
          if (res.success) {
            setReviews(res.data);
            // Optional: Calculate new average based on real reviews
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
      alert("Please log in first.");
      return;
    }

    setIsAdding(true); // 2. Start loading feedback

    try {
      // Pass the current product and the selected quantity
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
      setIsAdding(false); // 3. Stop loading feedback
    }
  };

  const handleToggleWishlist = async () => {
    if (!isLoggedIn) return alert("Please log in first.");
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
            />
          ))}
          <span className={styles.reviewCount}>({reviews.length} reviews)</span>
        </div>

        <p className={styles.description}>{product.description}</p>
        
        <div className={styles.actions}>
            <button className={styles.productDetailAddCart} onClick={handleAddToCart}>
              Add to Cart
            </button>
        </div>
        {showNotice && <div className={styles.cartNotice}>Added to cart!</div>}

        <img
          src={heartIcon}
          className={`${styles.wishlistIcon} ${isWishlisted ? styles.active : ""}`}
          onClick={handleToggleWishlist}
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
                    <strong>{rev.user.name}</strong>
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