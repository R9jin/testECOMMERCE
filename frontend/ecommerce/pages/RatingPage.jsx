import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { submitReview } from "../api/reviews";
import { useAuth } from "../context/AuthContext";
import { OrderHistoryContext } from "../context/OrderHistoryContext";
import styles from "../styles/RatingOrderPage.module.css";

export default function RatingPage() {
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const { transactions } = useContext(OrderHistoryContext);
  const { token } = useAuth();

  const [order, setOrder] = useState(null);
  // Store ratings for each product: { [productId]: { rating: 5, comment: "" } }
  const [reviews, setReviews] = useState({});

  useEffect(() => {
    if (transactions.length > 0) {
      const foundOrder = transactions.find((t) => String(t.id) === transactionId);
      if (foundOrder) setOrder(foundOrder);
    }
  }, [transactions, transactionId]);

  const handleRatingChange = (productId, rating) => {
    setReviews((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], rating },
    }));
  };

  const handleCommentChange = (productId, comment) => {
    setReviews((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], comment },
    }));
  };

  const handleSubmit = async () => {
    if (!order) return;

    // Loop through the state and submit reviews for items that have a rating
    const promises = Object.keys(reviews).map(async (productId) => {
      const reviewData = reviews[productId];
      if (reviewData.rating > 0) {
        return submitReview({
          product_id: productId, // passing the numeric ID from the item
          rating: reviewData.rating,
          comment: reviewData.comment
        }, token);
      }
    });

    await Promise.all(promises);
    alert("Reviews submitted successfully!");
    navigate("/order-history");
  };

  if (!order) return <p className={styles.trackOrderMainContainer}>Loading order...</p>;

  return (
    <div className={styles.trackOrderMainContainer}>
      <h2>Rate Your Items</h2>
      <p>Order ID: {order.id}</p>

      {order.items.map((item) => (
        <div key={item.id} className={styles.ratingGroup} style={{ borderBottom: "1px solid #eee", paddingBottom: "20px" }}>
          <p><strong>{item.product.name}</strong></p>
          
          <div style={{ margin: "10px 0" }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`${styles.star} ${
                  (reviews[item.product.id]?.rating || 0) >= star ? styles.active : ""
                }`}
                onClick={() => handleRatingChange(item.product.id, star)}
              >
                ★
              </span>
            ))}
          </div>

          <textarea
            className={styles.reviewTextarea}
            placeholder={`Review for ${item.product.name}...`}
            value={reviews[item.product.id]?.comment || ""}
            onChange={(e) => handleCommentChange(item.product.id, e.target.value)}
          />
        </div>
      ))}

      <button className={styles.saveBtn} onClick={handleSubmit}>
        Submit Reviews
      </button>
    </div>
  );
}