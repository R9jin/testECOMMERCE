import React from "react";
import ReactDOM from "react-dom/client";
import App from "./CCS112_Case-Study_E-Commerce_G10/App.js";
import { BrowserRouter } from "react-router-dom";

// Context providers
import { AuthProvider } from "./CCS112_Case-Study_E-Commerce_G10/ecommerce/context/AuthContext";
import { CartProvider } from "./CCS112_Case-Study_E-Commerce_G10/ecommerce/context/CartContext";
import { WishlistProvider } from "./CCS112_Case-Study_E-Commerce_G10/ecommerce/context/WishlistContext";
import { OrderHistoryProvider } from "./CCS112_Case-Study_E-Commerce_G10/ecommerce/context/OrderHistoryContext";
import { ProductsProvider } from "./CCS112_Case-Study_E-Commerce_G10/ecommerce/context/ProductsContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <OrderHistoryProvider>
              <ProductsProvider>
                <App />
              </ProductsProvider>
            </OrderHistoryProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
