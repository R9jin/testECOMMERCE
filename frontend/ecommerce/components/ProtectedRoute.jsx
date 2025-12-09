import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ✅ ProtectedRoute Component
 *
 * This component wraps around other components or pages that should
 * only be accessible to logged-in users.
 *
 * Example usage:
 * <ProtectedRoute>
 *   <ProfilePage />
 * </ProtectedRoute>
 *
 * If the user isn’t authenticated, they’ll be redirected to `/login`
 * instead of being allowed to view the protected page.
 */
function ProtectedRoute({ children }) {
  // ✅ Get the user's login state from AuthContext
  const { isLoggedIn } = useAuth();

  // ✅ useLocation() lets us know which page the user is currently trying to access
  const location = useLocation();

  // ✅ If not logged in, redirect to /login
  if (!isLoggedIn) {
    // The "state" prop saves the page they tried to visit before redirect,
    // so after logging in, they can be sent back to that original page.
    // Example: User tries /cart but isn’t logged in → redirected to /login
    // After login, they get redirected back to /cart.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ✅ If user is logged in, just render the children (the protected component)
  return children;
}

export default ProtectedRoute;
