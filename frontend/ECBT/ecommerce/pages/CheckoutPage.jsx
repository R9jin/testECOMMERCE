import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { OrderHistoryContext } from "../context/OrderHistoryContext"; 
import { ProductsContext } from "../context/ProductsContext";
import { useAuth } from "../context/AuthContext"; 
import styles from "../styles/CheckoutPage.module.css";

/**
 * CheckoutPage Component
 */
export default function CheckoutPage() {
  const { cartItems, clearCart } = useContext(CartContext);
  const { addTransaction } = useContext(OrderHistoryContext);
  const { products } = useContext(ProductsContext);
  const { currentUser } = useAuth(); 
  const navigate = useNavigate();

  const [billing, setBilling] = useState({
    firstName: "",
    lastName: "",
    address: "",
    zip: "",
    phone: "",
    email: "",
    notes: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("");
  const [eWalletType, setEWalletType] = useState("");

  useEffect(() => {
    if (currentUser) {
      setBilling((prev) => ({ ...prev, email: currentUser.email }));
    }
  }, [currentUser]);

  // Get product info from context instead of static JSON
  const getProduct = (id) => products.find((p) => p.id === id);

  const subtotal = cartItems.reduce((total, item) => {
    const product = getProduct(item.id);
    return total + (product?.price || 0) * item.quantity;
  }, 0);

  const handleChange = (e) => {
    setBilling({ ...billing, [e.target.name]: e.target.value });
  };

  const placeOrder = () => {
    if (!currentUser) return alert("Login first!");
    if (!paymentMethod) return alert("Select payment method!");
    if (paymentMethod === "E-Wallet" && !eWalletType)
      return alert("Please choose an e-wallet type.");
    if (!billing.firstName || !billing.lastName)
      return alert("Please fill out your billing information.");

    const newTransaction = {
      transactionId: Date.now(),
      user: currentUser.email,
      items: cartItems.map((item) => {
        const product = getProduct(item.id);
        return {
          id: item.id,
          name: product?.name,
          quantity: item.quantity,
          price: product?.price,
        };
      }),
      total: subtotal,
      date: new Date().toISOString().split("T")[0],
      paymentMethod,
      eWalletType: paymentMethod === "E-Wallet" ? eWalletType : null,
      address: billing.address,
    };

    addTransaction(newTransaction); 

    const key = `transactions_${currentUser.email}`;
    const existing = JSON.parse(localStorage.getItem(key)) || [];
    localStorage.setItem(key, JSON.stringify([...existing, newTransaction]));

    clearCart();
    alert("Order placed successfully!");
    navigate("/order-history");
  };

  return (
    <div className={styles.checkoutLayout}>
      <div className={styles.billingSection}>
        <h3>Billing Details</h3>
        <div className={styles.formGrid}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name*"
            value={billing.firstName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name*"
            value={billing.lastName}
            onChange={handleChange}
          />
        </div>

        <input
          type="text"
          name="address"
          placeholder="Address*"
          value={billing.address}
          onChange={handleChange}
        />

        <div className={styles.formGrid}>
          <input
            type="text"
            name="zip"
            placeholder="ZIP Code*"
            value={billing.zip}
            onChange={handleChange}
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone*"
            value={billing.phone}
            onChange={handleChange}
          />
        </div>

        <input
          type="email"
          name="email"
          placeholder="Email*"
          value={billing.email}
          readOnly
        />

        <textarea
          name="notes"
          placeholder="Order Notes (Optional)"
          value={billing.notes}
          onChange={handleChange}
        />
      </div>

      <div className={styles.orderSummaryCard}>
        <h3>Cart Summary</h3>

        {cartItems.length === 0 ? (
          <p>No items in cart.</p>
        ) : (
          <>
            {cartItems.map((item) => {
              const product = getProduct(item.id);
              return (
                <div key={item.id} className={styles.summaryItem}>
                  <span>{product?.name} (x{item.quantity})</span>
                  <span>₱{((product?.price || 0) * item.quantity).toFixed(2)}</span>
                </div>
              );
            })}

            <div className={styles.summaryTotal}>
              <strong>Total:</strong> ₱{subtotal.toFixed(2)}
            </div>

            <div className={styles.paymentOptions}>
              <label>
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Cash on Delivery
              </label>

              <label>
                <input
                  type="radio"
                  name="payment"
                  value="Card"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Credit/Debit Card
              </label>

              <label>
                <input
                  type="radio"
                  name="payment"
                  value="E-Wallet"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                E-Wallet
              </label>

              {paymentMethod === "E-Wallet" && (
                <select
                  value={eWalletType}
                  onChange={(e) => setEWalletType(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="GCash">GCash</option>
                  <option value="PayMaya">PayMaya</option>
                  <option value="PayPal">PayPal</option>
                </select>
              )}
            </div>

            <button
              className={styles.placeOrder}
              onClick={placeOrder}
              disabled={!currentUser}
            >
              {currentUser ? "Place Order" : "Login to Place Order"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
