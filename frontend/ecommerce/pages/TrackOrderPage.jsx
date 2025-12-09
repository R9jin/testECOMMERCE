import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { OrderHistoryContext } from "../context/OrderHistoryContext";
import styles from "../styles/TrackOrderPage.module.css";

const statuses = ["Ordered", "Payment", "Confirmation", "Delivery"];

export default function TrackOrderPage() {
  // ✅ Get refreshOrders from context
  const { transactions, refreshOrders } = useContext(OrderHistoryContext);
  const { addToCart, clearCart } = useContext(CartContext);
  const { token } = useAuth();
  const { transactionId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
  const [isCancelled, setIsCancelled] = useState(false);

  // Function to update status in Backend AND refresh Frontend context
  const handleDeliveryCompletion = async (id) => {
    try {
      // 1. Update Backend
      await fetch(`http://127.0.0.1:8000/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "Delivered" }),
      });

      // 2. Refresh Frontend Context immediately
      await refreshOrders();
      
    } catch (error) {
      console.error("Failed to update delivery status", error);
    }
  };

  useEffect(() => {
    const txn = transactions.find(
      (t) => t.id.toString() === transactionId
    );
    if (!txn) return;

    setOrder(txn);
    
    // Resume simulation if it exists in local storage
    const saved = JSON.parse(localStorage.getItem(`track_${txn.id}`));
    if (saved) {
        setCurrentStatusIndex(saved.statusIndex);
    } else {
        // If already delivered in DB, jump to end
        if (txn.status === 'Delivered') setCurrentStatusIndex(3);
    }
  }, [transactions, transactionId]);

  useEffect(() => {
    if (!order || isCancelled || currentStatusIndex === statuses.length - 1) return;

    const interval = setInterval(() => {
      setCurrentStatusIndex((prev) => {
        if (prev < statuses.length - 1) {
          const next = prev + 1;
          
          localStorage.setItem(
            `track_${order.id}`,
            JSON.stringify({ statusIndex: next })
          );

          // ✅ Check if this is the final step
          if (next === statuses.length - 1) {
            handleDeliveryCompletion(order.id);
          }

          return next;
        }
        
        clearInterval(interval);
        return prev;
      });
    }, 5000); 

    return () => clearInterval(interval);
  }, [order, isCancelled, currentStatusIndex, token]);

  if (!order) return <p>Order not found.</p>;

  return (
    <div className={styles.trackOrderMainContainer}>
      {/* ... (Keep your existing UI JSX same as before) ... */}
      {order.items.map((item) => (
        <div key={item.id} className={styles.trackOrderCard}>
          <img
            src={item.product?.image_url || item.image || "/placeholder.png"} 
            alt={item.name}
            className={styles.trackOrderImg}
          />
          <div className={styles.trackOrderDetails}>
            <p>{item.product?.name || item.name}</p>
            <p>₱{Number(item.price).toFixed(2)}</p>
            <p>Qty: {item.quantity}</p>
          </div>

          <div className={styles.trackOrderStatus}>
            {statuses.map((status, index) => (
              <div key={index} className={styles.statusStepContainer}>
                <div
                  className={`${styles.statusStep} ${
                    index <= currentStatusIndex ? styles.active : ""
                  }`}
                />
                <span
                  className={`${styles.statusLabel} ${
                    index <= currentStatusIndex ? styles.active : ""
                  }`}
                >
                  {status}
                </span>
              </div>
            ))}
            {isCancelled && <p className={styles.cancelledText}>Order Cancelled</p>}
          </div>

          <div className={styles.trackOrderButtons}>
            {currentStatusIndex === statuses.length - 1 && !isCancelled ? (
              <>
                <button
                  className={styles.rateOrderBtn}
                  onClick={() => navigate(`/rate-order/${order.id}`)}
                >
                  Rate Your Order
                </button>
                <button onClick={() => navigate('/checkout')}>Buy Again</button>
              </>
            ) : (
              <>
                <button disabled className={styles.trackingBtn}>
                  Tracking...
                </button>
                <button
                  className={styles.cancelBtn}
                  onClick={() => setIsCancelled(true)}
                >
                  Cancel Order
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}