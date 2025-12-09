import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as loginAPI, register } from "../api/auth";
import signInBanner from "../assets/signInBanner.png";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/SignUpPage.module.css";

function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    dob: "",
  });

  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ Added loading state
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      // Allow only numbers and max 11 chars
      if (!/^\d*$/.test(value)) return;
      if (value.length > 11) return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agree) {
      alert("You must agree to the terms & policy before signing up.");
      return;
    }

    if (formData.phone.length !== 11) {
      alert("Phone number must be exactly 11 digits.");
      return;
    }

    setLoading(true); // ✅ Start loading

    try {
      // 1. Register the user
      const registerResponse = await register(formData);
      
      if (registerResponse.error) {
        alert(registerResponse.error || "Failed to register. Try again.");
        setLoading(false); // Stop loading on error
        return;
      }

      // 2. Automatically log in the user
      const loginResponse = await loginAPI({
        email: formData.email,
        password: formData.password,
      });

      if (loginResponse.error) {
        alert(loginResponse.error || "Login failed after registration.");
        setLoading(false);
        return;
      }

      // 3. Update Global Auth Context
      login({ user: loginResponse.user, token: loginResponse.token });

      alert(`Account created successfully! Welcome, ${loginResponse.user.name}.`);
      navigate("/home", { replace: true });
      
    } catch (err) {
      console.error(err);
      alert("Registration failed. Please check your connection.");
    } finally {
      setLoading(false); // ✅ Ensure loading stops
    }
  };

  return (
    <div className={styles.signupWrapper}>
      <div className={styles.signupFormContainer}>
        <h2>Create Account</h2>
        <p>Join us today!</p>
        <form onSubmit={handleSubmit} className={styles.signupForm}>
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />

          <label>Email address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />

          <label>Phone number</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            required
            maxLength="11"
            inputMode="numeric"
          />

          <label>Gender</label>
          <select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <label>Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
          />

          <div className={styles.signupOptions}>
            <input
              type="checkbox"
              id="agree"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            <label htmlFor="agree"> I agree to the terms & policy</label>
          </div>

          <button
            type="submit"
            className={styles.signupBtn}
            disabled={
              loading || // ✅ Disable while loading
              !formData.name ||
              !formData.email ||
              !formData.password ||
              !formData.phone ||
              !formData.gender ||
              !formData.dob ||
              !agree
            }
            style={{ 
              opacity: loading ? 0.7 : 1, 
              cursor: loading ? 'not-allowed' : 'pointer' 
            }}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className={styles.loginText}>
          Already have an account?{" "}
          <Link to="/login" className={styles.loginLink}>
            Sign in
          </Link>
        </p>
      </div>

      <div className={styles.signupBanner}>
        <img src={signInBanner} alt="Sign up banner" />
      </div>
    </div>
  );
}

export default SignUpPage;