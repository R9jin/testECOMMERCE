import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import styles from "../styles/CartPage.module.css";
import cancelIcon from "../assets/cancel.png";

/**
 * CartPage Component
 *
 * Displays the user's shopping cart and allows interaction with cart items.
 * Works with API-backed cart and product info.
 */
export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  // Calculate subtotal directly from cartItems
  const subtotal = cartItems.reduce((total, item) => {
    return total + (item.price || 0) * item.quantity;
  }, 0);

  const shippingFee = subtotal < 200 && subtotal > 0 ? 0 : 50;
  const totalPrice = subtotal + shippingFee;

  return (
    <div className={styles.cartContainer}>
      {cartItems.length === 0 && <p>Your cart is empty.</p>}

      {cartItems.map((item) => {
        const availableStock = item.stock ?? 0;
        const itemSubtotal = (item.price || 0) * item.quantity;

        return (
          <div key={item.id} className={styles.cartItem}>
            <div className={styles.cartInfo}>
              <img src={item.image} alt={item.name} />
              <div>
                <p><strong>{item.name}</strong></p>
                <p>Price: ₱{item.price}</p>
                <p className={availableStock > 0 ? styles.inStock : styles.outOfStock}>
                  {availableStock > 0
                    ? `Stock Available: ${availableStock}`
                    : "Out of Stock"}
                </p>
                <p className={styles.subtotal}>Subtotal: ₱{itemSubtotal.toFixed(2)}</p>
              </div>
            </div>

            <div className={styles.cartActions}>
              <input
                type="number"
                value={item.quantity}
                min="1"
                max={availableStock}
                onChange={(e) => {
                  const newQty = parseInt(e.target.value, 10);
                  if (newQty >= 1 && newQty <= availableStock) {
                    updateQuantity(item.id, newQty);
                  }
                }}
              />

              <button
                onClick={() => {
                  if (window.confirm(`Remove ${item.name} from the cart?`)) {
                    removeFromCart(item.id);
                  }
                }}
                className={styles.removeButton}
              >
                <img src={cancelIcon} alt="Remove" className={styles.cancelIcon} />
              </button>
            </div>
          </div>
        );
      })}

      {cartItems.length > 0 && (
        <>
          <div className={styles.cartSummary}>
            <div className={styles.cartSummaryRow}>
              <span>Subtotal:</span>
              <span>₱{subtotal.toFixed(2)}</span>
            </div>
            <div className={styles.cartSummaryRow}>
              <span>Shipping Fee:</span>
              <span>{shippingFee > 0 ? `₱${shippingFee}` : "Free"}</span>
            </div>
            <div className={`${styles.cartSummaryRow} ${styles.total}`}>
              <span>Total:</span>
              <span>₱{totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <button
            className={styles.cartButton}
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
}
