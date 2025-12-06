import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../styles/RatingOrderPage.module.css"; // ✅ CSS Module

export default function RatingPage() {
  const { transactionId } = useParams();
  const navigate = useNavigate();

  const [foodRating, setFoodRating] = useState(0);
  const [deliveryRating, setDeliveryRating] = useState(0);
  const [review, setReview] = useState("");

  const handleSubmitRating = () => {
    const ratings = { transactionId, foodRating, deliveryRating, review };
    localStorage.setItem(`rating_${transactionId}`, JSON.stringify(ratings));
    alert("Thank you for your feedback!");
    navigate("/order-history");
  };

  return (
    <div className={styles.trackOrderMainContainer}>
      <h2>Rate Your Order</h2>

      <div className={styles.ratingGroup}>
        <label>Food Rating:</label>
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`${styles.star} ${i <= foodRating ? styles.active : ""}`}
            onClick={() => setFoodRating(i)}
          >
            ★
          </span>
        ))}
      </div>

      <div className={styles.ratingGroup}>
        <label>Delivery Rating:</label>
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`${styles.star} ${i <= deliveryRating ? styles.active : ""}`}
            onClick={() => setDeliveryRating(i)}
          >
            ★
          </span>
        ))}
      </div>

      <label>Review:</label>
      <textarea
        className={styles.reviewTextarea}
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Write your feedback here..."
      />

      <button className={styles.saveBtn} onClick={handleSubmitRating}>
        Submit Rating
      </button>
    </div>
  );
}
