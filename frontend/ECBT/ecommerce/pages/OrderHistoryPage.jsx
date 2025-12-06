import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { OrderHistoryContext } from "../context/OrderHistoryContext";
import { CartContext } from "../context/CartContext";
import styles from "../styles/OrderHistory.module.css";

/**
 * OrderHistoryPage Component - fetches from API
 */
export default function OrderHistoryPage() {
  const { transactions, addTransaction } = useContext(OrderHistoryContext);
  const { addToCart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [statusesMap, setStatusesMap] = useState({});

  const statuses = ["Ordered", "Payment", "Confirmation", "Delivery"];

  useEffect(() => {
    // Map each transaction to its current status (default 0)
    const map = {};
    transactions.forEach((t) => {
      map[t.id] = t.statusIndex || 0; // assume Laravel API returns statusIndex
    });
    setStatusesMap(map);
  }, [transactions]);

  const handleBuyAgain = (items) => {
    clearCart();
    items.forEach((item) => {
      addToCart({
        id: item.product.id,
        name: item.product.name,
        price: item.price,
        image: item.product.image,
        quantity: item.quantity,
      });
    });
    navigate("/checkout");
  };

  const getSafePrice = (item) => item.price ?? 0;

  return (
    <div className={styles.orderContainer}>
      <h2>Order History</h2>
      {transactions.length === 0 && <p>No orders found.</p>}

      {transactions.map((transaction) => {
        const statusIndex = statusesMap[transaction.id] || 0;
        const isDelivered = statusIndex === statuses.length - 1;

        return (
          <div key={transaction.id} className={styles.cartItem}>
            <div className={styles.cartInfo}>
              <div className={styles.transactionInfo}>
                <p><strong>Transaction ID:</strong> {transaction.id}</p>
                <p><strong>Email:</strong> {transaction.user.email}</p>
                <p><strong>Date:</strong> {new Date(transaction.created_at).toLocaleDateString()}</p>
              </div>

              <table className={styles.orderTable}>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {transaction.items.map((item) => (
                    <tr key={item.product.id}>
                      <td>
                        {item.product.image && (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className={styles.orderItemImg}
                          />
                        )}
                      </td>
                      <td>{item.product.name}</td>
                      <td>{item.quantity}</td>
                      <td>₱{getSafePrice(item).toFixed(2)}</td>
                      <td>₱{(getSafePrice(item) * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p className={styles.transactionTotal}>
                <strong>Total:</strong> ₱{transaction.total.toFixed(2)}
              </p>

              {isDelivered ? (
                <button
                  className={styles.buyAgainBtn}
                  onClick={() => handleBuyAgain(transaction.items)}
                >
                  Buy Again
                </button>
              ) : (
                <button
                  className={styles.trackOrderBtn}
                  onClick={() =>
                    navigate(`/track-order/${transaction.id}`)
                  }
                >
                  Track Order
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
