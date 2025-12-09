import { createContext, useContext, useEffect, useState } from "react";
import { login as apiLogin, updateUser as apiUpdateUser } from "../api/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);

  // Restore session from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("currentUser");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setCurrentUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const data = await apiLogin(credentials); // expects { user, token }

      if (data.token) {
        setToken(data.token);
        setCurrentUser(data.user);
        setIsLoggedIn(true);

        localStorage.setItem("token", data.token);
        localStorage.setItem("currentUser", JSON.stringify(data.user));

        return { success: true, user: data.user };
      } else if (data.error) {
        return { success: false, error: data.error };
      } else {
        return { success: false, error: "Unknown login error" };
      }
    } catch (err) {
      console.error("Login failed:", err);
      return { success: false, error: "Login failed. Please try again." };
    }
  };

  // Logout
  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
  };

  const updateProfile = async (userData) => {
    try {
      const data = await apiUpdateUser(userData, token);
      
      if (data.success) {
        // Update local state and storage
        setCurrentUser(data.user);
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        return { success: true };
      } else {
        return { success: false, error: data.error || "Update failed" };
      }
    } catch (err) {
      console.error(err);
      return { success: false, error: "Network error" };
    }
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, currentUser, token, login, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
