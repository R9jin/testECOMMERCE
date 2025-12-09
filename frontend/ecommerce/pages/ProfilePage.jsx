import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ProductsContext } from "../context/ProductsContext";
import styles from "../styles/ProfilePage.module.css";
import { safeParse } from "../utils/storage";

function ProfilePage() {
  const [editableUser, setEditableUser] = useState({});
  // 1. New state for loading status
  const [updating, setUpdating] = useState(false); 
  
  const navigate = useNavigate();
  
  // 2. Destructure currentUser correctly
  const { currentUser, logout, updateProfile } = useAuth();
  const { restoreProductsAPI } = useContext(ProductsContext);

  useEffect(() => {
    if (currentUser) {
      setEditableUser(currentUser);
    } else {
      const stored = localStorage.getItem("currentUser");
      if (stored) setEditableUser(JSON.parse(stored));
      else navigate("/login");
    }
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    setEditableUser({ ...editableUser, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    // 3. Start loading
    setUpdating(true); 

    try {
      const result = await updateProfile(editableUser);

      if (result.success) {
        alert("✅ Profile updated successfully!");
      } else {
        alert(`❌ Failed to update: ${result.error}`);
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("An unexpected error occurred.");
    } finally {
      // 4. Stop loading regardless of success or failure
      setUpdating(false);
    }
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
    if (window.confirm("⚠️ This action cannot be undone.\n\nAre you sure you want to permanently delete your account?")) {
      const users = safeParse("users");
      const remainingUsers = users.filter((u) => u.email !== editableUser.email);
      localStorage.setItem("users", JSON.stringify(remainingUsers));
      localStorage.removeItem("currentUser");
      localStorage.removeItem("isLoggedIn");

      alert("🗑️ Account deleted successfully.");
      navigate("/login");
    }
  };

  const handleOrderHistory = () => navigate("/order-history");

  const handleRestoreProducts = async () => {
    if (window.confirm("⚠️ This will delete ALL products and re-seed the database to defaults. Continue?")) {
      try {
        const res = await restoreProductsAPI();
        if (res.success) {
          alert("✅ Database re-seeded successfully!");
        } else {
          alert("Failed to restore products.");
        }
      } catch (error) {
        console.error("Restore error:", error);
        alert("An error occurred connecting to the server.");
      }
    }
  };

  // 5. Check currentUser instead of 'user'
  if (!currentUser)
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
          <button className={styles.btnOrderHistory} onClick={handleOrderHistory}>
            Order History
          </button>

          {currentUser?.role === "admin" && (
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
            className={styles.formInput}
          />

          <label>Phone Number</label>
          <input
            name="phone"
            value={editableUser.phone || ""}
            onChange={handleChange}
            className={styles.formInput}
          />

          <label>Gender</label>
          <select
            name="gender"
            value={editableUser.gender || ""}
            onChange={handleChange}
            className={styles.formInput}
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            {/* 6. Ensure value matches DB expectation */}
            <option value="Others">Others</option> 
          </select>

          <label>Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={editableUser.dob || ""}
            onChange={handleChange}
            className={styles.formInput}
          />

          {/* 7. Button Feedback Implementation */}
          <button
            type="submit"
            className={styles.saveBtn}
            disabled={updating} // Disable while updating
            style={{ opacity: updating ? 0.7 : 1, cursor: updating ? 'not-allowed' : 'pointer' }}
          >
            {updating ? "Updating..." : "UPDATE"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;