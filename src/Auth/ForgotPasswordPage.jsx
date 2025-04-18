import React, { useState } from "react";
import { auth, sendPasswordResetEmail } from "../firebase"; // ✅ Import Firebase auth
import styles from "./LoginPage.module.css"; // ✅ Import as a module
import { Link } from "react-router-dom";

function ForgottenPassPage() {
  const [email, setEmail] = useState(""); // Store user input for email
  const [error, setError] = useState(""); // For displaying errors
  const [message, setMessage] = useState(""); // For success message

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      // ✅ Correct usage: pass auth as first argument
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Please check your inbox.");
      setError("");
    } catch (error) {
      setMessage("");
      setError("Error: " + error.message);
    }
  };

  return (
    <div className={styles["body"]}>
      <div className={styles["wrap-container"]}>
        <div className={styles["new-container"]}>
          <form onSubmit={handleSubmit}>
            <h1>RESET PASSWORD</h1>
            <div className={styles["input-field"]}>
              <input
                className={styles["user-entry"]}
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={handleEmailChange}
                required
              />
            </div>
            {error && <p className={styles["error-message"]}>{error}</p>}{" "}
            {/* Error message */}
            {message && (
              <p className={styles["success-message"]}>{message}</p>
            )}{" "}
            {/* Success message */}
            <button className={styles["submit-btn"]} type="submit">
              SEND LINK
            </button>
            <p>
              Remembered your password? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgottenPassPage;
