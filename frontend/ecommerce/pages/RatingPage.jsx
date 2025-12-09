import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { submitReview } from "../api/reviews";
import { useAuth } from "../context/AuthContext";
import { OrderHistoryContext } from "../context/OrderHistoryContext";
import styles from "../styles/RatingOrderPage.module.css";

export default function RatingPage() {
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const { transactions, refreshOrders } = useContext(OrderHistoryContext);
  const { token } = useAuth();

  const [order, setOrder] = useState(null);
  const [reviews, setReviews] = useState({});
  const [submitting, setSubmitting] = useState(false);

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

  const updateOrderStatusToCompleted = async (orderId) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "Completed" }),
      });
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const handleSubmit = async () => {
    if (!order) return;

    const allRated = order.items.every(
      (item) => reviews[item.product.id]?.rating > 0
    );

    if (!allRated) {
      alert("Please rate all items before submitting.");
      return;
    }

    setSubmitting(true);

    try {
      const promises = order.items.map((item) => {
        const reviewData = reviews[item.product.id];
        return submitReview(
          {
            product_id: item.product.id,
            rating: reviewData.rating,
            comment: reviewData.comment || "",
          },
          token
        );
      });

      await Promise.all(promises);
      await updateOrderStatusToCompleted(order.id);
      await refreshOrders();

      alert("Reviews submitted! Order completed.");
      navigate("/order-history");
    } catch (error) {
      console.error("Failed to submit reviews:", error);
      alert("An error occurred while submitting your reviews.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!order) return <p className={styles.trackOrderMainContainer}>Loading order...</p>;

  return (
    <div className={styles.trackOrderMainContainer}>
      <h2>Rate Your Items</h2>
      <p>Order ID: {order.id}</p>

      {order.items.map((item) => (
        <div key={item.id} className={styles.ratingItem}>
          <p><strong>{item.product.name}</strong></p>
          
          <div className={styles.starContainer}>
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

      <button 
        className={styles.saveBtn} 
        onClick={handleSubmit}
        disabled={submitting}
      >
        {submitting ? "Submitting Reviews..." : "Submit Reviews"}
      </button>
    </div>
  );
}