import React, { useState } from "react";
import styles from "../styles/LogInPage.module.css";
import signInBanner from "../assets/signInBanner.png";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LogInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agree) {
      alert("You must agree to the terms & policy before logging in.");
      return;
    }

    setLoading(true);
    try {
      const response = await login({ email: email.trim(), password });

      if (!response.success) {
        alert(response.error || "Login failed.");
      } else {
        navigate("/home", { replace: true });
        setTimeout(() => alert(`Welcome back, ${response.user.name}!`), 100);
      }
    } catch (err) {
      console.error(err);
      alert("Login failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginFormContainer}>
        <h2>Welcome back!</h2>
        <p>Enter your credentials to access your account</p>

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <label>Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />

          <div className={styles.loginOptions}>
            <div>
              <input
                type="checkbox"
                id="agree"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              <label htmlFor="agree"> I agree to the terms & policy</label>
            </div>
            <button
              type="button"
              className={styles.forgot}
              onClick={() => alert("Password reset feature coming soon.")}
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className={styles.loginBtn}
            disabled={!email || !password || loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className={styles.signupText}>
          Don’t have an account?{" "}
          <Link to="/signup" className={styles.signupLink}>
            Sign up
          </Link>
        </p>
      </div>

      <div className={styles.loginBanner}>
        <img src={signInBanner} alt="Sign in banner" />
      </div>
    </div>
  );
}

export default LogInPage;
