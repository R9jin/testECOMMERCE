import React, { useEffect, useState } from "react";
import styles from "../styles/ProfilePage.module.css"; // ✅ CSS Module
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { safeParse } from "../utils/storage";
import productsData from "../data/products.json";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [editableUser, setEditableUser] = useState({});
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const current = safeParse("currentUser");
    if (current) {
      setUser(current);
      setEditableUser(current);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setEditableUser({ ...editableUser, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    localStorage.setItem("currentUser", JSON.stringify(editableUser));

    const users = safeParse("users");
    const updatedUsers = users.map((u) =>
      u.email === editableUser.email ? editableUser : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    alert("✅ Profile updated successfully!");
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
      localStorage.removeItem("currentUser");
      localStorage.removeItem("isLoggedIn");
      alert("You have been logged out.");
      navigate("/login");
    }
  };

  const handleDelete = () => {
    if (
      window.confirm(
        "⚠️ This action cannot be undone.\n\nAre you sure you want to permanently delete your account?"
      )
    ) {
      const users = safeParse("users");
      const remainingUsers = users.filter(
        (u) => u.email !== editableUser.email
      );
      localStorage.setItem("users", JSON.stringify(remainingUsers));
      localStorage.removeItem("currentUser");
      localStorage.removeItem("isLoggedIn");

      alert("🗑️ Account deleted successfully.");
      navigate("/login");
    }
  };

  const handleOrderHistory = () => navigate("/order-history");

  const handleRestoreProducts = () => {
    if (window.confirm("Restore all products to default?")) {
      localStorage.setItem("products", JSON.stringify(productsData));
      alert("Products restored to default!");
      window.location.reload();
    }
  };

  if (!user)
    return <p style={{ textAlign: "center" }}>Please log in first.</p>;

  return (
    <div className={styles.profileContainer}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <h3>MY ACCOUNT</h3>
        <div className={styles.sidebarButtons}>
          <button className={styles.btnLogout} onClick={handleLogout}>
            Logout
          </button>
          <button className={styles.btnDelete} onClick={handleDelete}>
            Delete Account
          </button>
          <button
            className={styles.btnOrderHistory}
            onClick={handleOrderHistory}
          >
            Order History
          </button>

          {user?.role === "admin" && (
            <>
              <button
                className={styles.btnAdminDashboard}
                onClick={() => navigate("/admin")}
              >
                Admin Dashboard
              </button>
              <button
                className={styles.btnRestoreProducts}
                onClick={handleRestoreProducts}
              >
                Restore Products
              </button>
            </>
          )}
        </div>
      </div>

      {/* Profile Form */}
      <div className={styles.profileContent}>
        <h2>MY PROFILE</h2>
        <form className={styles.profileForm} onSubmit={handleUpdate}>
          <label>Email (cannot be changed)</label>
          <input type="email" value={editableUser.email || ""} disabled />

          <label>Name</label>
          <input
            name="name"
            value={editableUser.name || ""}
            onChange={handleChange}
          />

          <label>Phone Number</label>
          <input
            name="phone"
            value={editableUser.phone || ""}
            onChange={handleChange}
          />

          <label>Gender</label>
          <select
            name="gender"
            value={editableUser.gender || ""}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <label>Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={editableUser.dob || ""}
            onChange={handleChange}
          />

          <button type="submit" className={styles.saveBtn}>
            UPDATE
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
