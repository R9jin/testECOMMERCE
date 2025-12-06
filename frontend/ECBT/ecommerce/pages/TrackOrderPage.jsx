import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { OrderHistoryContext } from "../context/OrderHistoryContext";
import productsData from "../data/products.json";
import styles from "../styles/TrackOrderPage.module.css"; // ✅ CSS Module

const statuses = ["Ordered", "Payment", "Confirmation", "Delivery"];

export default function TrackOrderPage() {
  const { transactions } = useContext(OrderHistoryContext);
  const { addToCart, clearCart } = useContext(CartContext);
  const { transactionId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
  const [isCancelled, setIsCancelled] = useState(false);

  useEffect(() => {
    const txn = transactions.find(
      (t) => t.transactionId.toString() === transactionId
    );
    if (!txn) return;

    setOrder(txn);
    const saved = JSON.parse(localStorage.getItem(`track_${txn.transactionId}`));
    if (saved) setCurrentStatusIndex(saved.statusIndex);
  }, [transactions, transactionId]);

  useEffect(() => {
    if (!order || isCancelled) return;

    const interval = setInterval(() => {
      setCurrentStatusIndex((prev) => {
        if (prev < statuses.length - 1) {
          const next = prev + 1;
          localStorage.setItem(
            `track_${order.transactionId}`,
            JSON.stringify({ statusIndex: next })
          );
          return next;
        }
        clearInterval(interval);
        return prev;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [order, isCancelled]);

  if (!order) return <p>Order not found.</p>;

  const getProductImage = (id) => {
    const product = productsData.find((p) => p.id === id);
    return product?.image || "";
  };

  const buyAgain = () => {
    if (!order) return;

    clearCart();

    order.items.forEach((item) => {
      const product = productsData.find((p) => p.id === item.id);
      if (!product) return;

      addToCart({
        id: product.id,
        name: product.name,
        price: product.price || 0,
        image: product.image,
        quantity: item.quantity || 1,
      });
    });

    alert("Items added to cart!");
    navigate("/checkout");
  };

  return (
    <div className={styles.trackOrderMainContainer}>
      {order.items.map((item) => (
        <div key={item.id} className={styles.trackOrderCard}>
          <img
            src={getProductImage(item.id)}
            alt={item.name}
            className={styles.trackOrderImg}
          />
          <div className={styles.trackOrderDetails}>
            <p>{item.name}</p>
            <p>₱{item.price.toFixed(2)}</p>
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
                <span className={styles.statusDate}>{order.date}</span>
              </div>
            ))}
            {isCancelled && (
              <p className={styles.cancelledText}>Order Cancelled</p>
            )}
          </div>

          <div className={styles.trackOrderButtons}>
            {currentStatusIndex === statuses.length - 1 && !isCancelled ? (
              <>
                <button
                  className={styles.rateOrderBtn}
                  onClick={() =>
                    navigate(`/rate-order/${order.transactionId}`)
                  }
                >
                  Rate Your Order
                </button>
                <button onClick={buyAgain}>Buy Again</button>
              </>
            ) : (
              <>
                <button onClick={() => alert("Tracking order...")}>
                  Track Order
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
