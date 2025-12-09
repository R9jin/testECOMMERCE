import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { OrderHistoryContext } from "../context/OrderHistoryContext";
import styles from "../styles/OrderHistory.module.css";

export default function OrderHistoryPage() {
  const { transactions } = useContext(OrderHistoryContext);
  const { addToCart, clearCart } = useContext(CartContext);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleBuyAgain = (items) => {
    clearCart();
    items.forEach((item) => {
      addToCart({
        id: item.product.id, // Ensure this matches your product ID field
        name: item.product.name,
        price: item.product.price, 
        image: item.product.image_url, 
        quantity: item.quantity,
      });
    });
    navigate("/checkout");
  };

  return (
    <div className={styles.orderContainer}>
      <h2>Order History</h2>
      {transactions.length === 0 && <p>No orders found.</p>}

      {transactions.map((transaction) => {
        const isDelivered = transaction.status === "Delivered";

        return (
          <div key={transaction.id} className={styles.cartItem}>
            <div className={styles.cartInfo}>
              <div className={styles.transactionInfo}>
                <p><strong>Order ID:</strong> {transaction.id}</p>
                <p><strong>Email:</strong> {currentUser?.email}</p>
                <p><strong>Date:</strong> {new Date(transaction.created_at).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {transaction.status}</p>
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
                    <tr key={item.id}>
                      <td>
                        {/* Fix: Use item.product.image_url directly.
                           Since paths are like "/assets/...", they resolve to the React public folder.
                        */}
                        {item.product.image_url && (
                          <img
                            src={item.product.image_url} 
                            alt={item.product.name}
                            className={styles.orderItemImg}
                            onError={(e) => {
                                e.target.onerror = null; 
                                e.target.style.display = 'none'; // Hide if missing
                            }}
                          />
                        )}
                      </td>
                      <td>{item.product.name}</td>
                      <td>{item.quantity}</td>
                      {/* Use item.price (price at time of order) */}
                      <td>₱{Number(item.price).toFixed(2)}</td>
                      <td>₱{(Number(item.price) * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p className={styles.transactionTotal}>
                {/* Fix: Laravel uses total_price */}
                <strong>Total:</strong> ₱{Number(transaction.total_price).toFixed(2)}
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