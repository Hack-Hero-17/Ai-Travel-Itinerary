import React, { useState, useEffect } from "react";
import styles from "./LoginPage.module.css";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { FaGoogle } from "react-icons/fa";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  // Redirect if the user is already logged in
  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        pass
      );
      const user = userCredential.user;

      // ✅ Add this block right here:
      if (!user.emailVerified) {
        await auth.signOut(); // Immediately log them out
        alert("Please verify your email before logging in.");
        return;
      }
      const token = await userCredential.user.getIdToken();

      // Store token and userId in localStorage or sessionStorage based on "Remember me" state
      if (rememberMe) {
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userCredential.user.uid); // Store userId
      } else {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("userId", userCredential.user.uid); // Store userId
      }

      navigate("/");
    } catch (err) {
      setError("Login failed. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();

      // Store token and userId in localStorage or sessionStorage based on "Remember me" state
      if (rememberMe) {
        localStorage.setItem("token", token);
        localStorage.setItem("userId", result.user.uid); // Store userId
      } else {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("userId", result.user.uid); // Store userId
      }

      navigate("/");
    } catch (err) {
      setError("Google Login failed. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["body"]}>
      {loading && (
        <div className={styles["loading-overlay"]}>
          <div className={styles["spinner"]}></div>
          <p>Logging you in...</p>
        </div>
      )}

      <div className={styles["wrap-container"]}>
        <div className={styles["new-container"]}>
          <form onSubmit={handleLogin}>
            <h1>LOGIN</h1>
            {error && <p className={styles.error}>{error}</p>}

            <div className={styles["input-field"]}>
              <input
                className={styles["user-entry"]}
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles["input-field"]}>
              <input
                className={styles["user-entry"]}
                type="password"
                placeholder="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                required
              />
            </div>

            <div className={styles["remember-actions"]}>
              <label>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
              <Link to="/forgot-password">Forget Password?</Link>
            </div>

            <button className={styles["submit-btn"]} type="submit">
              SIGN IN
            </button>

            <div className={styles["button-container"]}>
              <button
                onClick={handleGoogleLogin}
                className={styles["submit-btn"]}
                type="button"
              >
                <FaGoogle style={{ marginRight: "8px" }} />
                Sign In with Google
              </button>
            </div>

            <p>
              Don't have an account? <Link to="/signup">Register</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
