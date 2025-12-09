import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { OrderHistoryContext } from "../context/OrderHistoryContext";
import styles from "../styles/TrackOrderPage.module.css";

const statuses = ["Ordered", "Payment", "Confirmation", "Delivery"];

export default function TrackOrderPage() {
  const { transactions, refreshOrders } = useContext(OrderHistoryContext);
  const { addToCart, clearCart } = useContext(CartContext);
  const { token } = useAuth();
  const { transactionId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
  const [isCancelled, setIsCancelled] = useState(false);

  const handleDeliveryCompletion = async (id) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "Delivered" }),
      });
      await refreshOrders();
    } catch (error) {
      console.error("Failed to update delivery status", error);
    }
  };

  useEffect(() => {
    const txn = transactions.find((t) => t.id.toString() === transactionId);
    if (!txn) return;

    setOrder(txn);
    
    if (txn.status === 'Delivered' || txn.status === 'Completed') {
        setCurrentStatusIndex(statuses.length - 1);
    } else {
        const saved = JSON.parse(localStorage.getItem(`track_${txn.id}`));
        if (saved) {
            setCurrentStatusIndex(saved.statusIndex);
        }
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

  const handleBuyAgain = () => {
    clearCart();
    order.items.forEach((item) => {
      addToCart({
        id: item.product.id,
        name: item.product.name,
        price: item.price,
        image: item.product.image_url,
        quantity: item.quantity,
      });
    });
    navigate("/checkout");
  };

  if (!order) return <p>Order not found.</p>;

  return (
    <div className={styles.trackOrderMainContainer}>
      
      {/* 1. Order Items List */}
      <div className={styles.orderItemsCard}>
        <h3>Order #{order.id} Items</h3>
        {order.items.map((item) => (
          <div key={item.id} className={styles.orderItemRow}>
            <img
              src={item.product?.image_url || item.image || "/placeholder.png"} 
              alt={item.name}
              className={styles.orderItemImage}
            />
            <div className={styles.orderItemInfo}>
              <p>{item.product?.name || item.name}</p>
              <p className={styles.orderItemPrice}>₱{Number(item.price).toFixed(2)} x {item.quantity}</p>
            </div>
          </div>
        ))}
        <p className={styles.orderTotal}>
            Total: ₱{Number(order.total_price).toFixed(2)}
        </p>
      </div>

      {/* 2. Tracking Card */}
      <div className={styles.trackOrderCard}>
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
              {order.status !== 'Completed' && (
                <button
                    className={styles.rateOrderBtn}
                    onClick={() => navigate(`/rate-order/${order.id}`)}
                >
                    Rate Your Order
                </button>
              )}
              <button onClick={handleBuyAgain}>Buy Again</button>
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
    </div>
  );
}