import { Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "./ecommerce/components/ProtectedRoute";

// Components & pages
import Navbar from "./ecommerce/components/Navbar";
import Banner from "./ecommerce/components/Banner";
import Footer from "./ecommerce/components/Footer";
import ScrollToHashElement from "./ecommerce/components/ScrollToHashElement";
import HomePage from "./ecommerce/pages/HomePage";
import CategoryPage from "./ecommerce/pages/CategoryPage";
import ProfilePage from "./ecommerce/pages/ProfilePage";
import WishlistPage from "./ecommerce/pages/WishlistPage";
import CartPage from "./ecommerce/pages/CartPage";
import CheckoutPage from "./ecommerce/pages/CheckoutPage";
import LogInPage from "./ecommerce/pages/LogInPage";
import SignUpPage from "./ecommerce/pages/SignUpPage";
import ProductDetailsPage from "./ecommerce/pages/ProductDetailsPage";
import AdminDashboardPage from "./ecommerce/pages/AdminDashboardPage";
import SearchResultsPage from "./ecommerce/pages/SearchResultsPage";
import OrderHistoryPage from "./ecommerce/pages/OrderHistoryPage";
import TrackOrderPage from "./ecommerce/pages/TrackOrderPage";
import RatingPage from "./ecommerce/pages/RatingPage";

function App() {
  const location = useLocation();
  const hideHeaderFooter =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      {!hideHeaderFooter && <Navbar />}
      {!hideHeaderFooter && <Banner />}

      <ScrollToHashElement />

      <div className="container">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LogInPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/category"
            element={
              <ProtectedRoute>
                <CategoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProtectedRoute>
                <ProductDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <WishlistPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <SearchResultsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-history"
            element={
              <ProtectedRoute>
                <OrderHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/track-order/:transactionId"
            element={
              <ProtectedRoute>
                <TrackOrderPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rate-order/:transactionId"
            element={
              <ProtectedRoute>
                <RatingPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>

      {!hideHeaderFooter && <Footer />}
    </>
  );
}

export default App;
