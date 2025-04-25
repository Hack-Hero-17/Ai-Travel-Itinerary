import React, { useState } from "react";
import styles from "./LoginPage.module.css";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  googleProvider,
  githubProvider,
  signInWithPopup,
} from "../firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import axios from "axios";
import bcrypt from "bcryptjs";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";

function SignUpPage() {
  const [email, setEmail] = useState("");
  const [uname, setUname] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Loading state
  const Navigate = useNavigate();

  const randomPassword = uuidv4(); // or any secure random generator
  const hashedPassword = bcrypt.hashSync(randomPassword, 10);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    const hashedPassword = bcrypt.hashSync(password, 10);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // ✅ Send email verification
      await sendEmailVerification(user);

      const userDetails = {
        username: uname,
        userId: user.uid,
        email: user.email,
        password: hashedPassword,
        registrationTime: new Date().toISOString(),
        profileImage: "",
      };

      await axios.post("http://localhost:5000/api/user/signup", userDetails);

      alert(
        "🎉 Registered successfully! Please check your inbox to verify your email before logging in."
      );

      Navigate("/login");
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userDetails = {
        username: user.email.split("@")[0],
        userId: user.uid,
        email: user.email,
        password: hashedPassword,
        registrationTime: new Date().toISOString(),
        provider: "google",
        profileImage: user.photoURL || "",
      };

      await axios.post("http://localhost:5000/api/user/signup", userDetails);
      alert("Google user registered successfully! Now you can log in.");
      Navigate("/login");
    } catch (error) {
      alert("Google Sign-Up Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubSignUp = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;

      const userDetails = {
        username: user.email.split("@")[0], // Use email prefix as username
        userId: user.uid,
        email: user.email,
        password: hashedPassword,
        registrationTime: new Date().toISOString(),
        provider: "github",
        profileImage: user.photoURL || "",
      };

      await axios.post("http://localhost:5000/api/user/signup", userDetails);
      alert("GitHub user registered successfully! Now you can log in.");
      Navigate("/login");
    } catch (error) {
      alert("GitHub Sign-Up Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["body"]}>
      {loading && (
        <div className={styles["loading-overlay"]}>
          <div className={styles["spinner"]}></div>
          <p>Signing you up...</p>
        </div>
      )}

      <div className={styles["wrap-container"]}>
        <div className={styles["new-container"]}>
          <form onSubmit={handleSignUp}>
            <h1>REGISTER</h1>
            <div className={styles["input-field"]}>
              <input
                className={styles["user-entry"]}
                type="text"
                placeholder="username"
                required
                value={uname}
                onChange={(e) => setUname(e.target.value)}
              />
            </div>
            <div className={styles["input-field"]}>
              <input
                className={styles["user-entry"]}
                type="email"
                placeholder="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={styles["input-field"]}>
              <input
                className={styles["user-entry"]}
                type="password"
                placeholder="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className={styles["submit-btn"]} type="submit">
              SIGN UP
            </button>
          </form>

          <div className={styles["button-container"]}>
            <button
              onClick={handleGoogleSignUp}
              className={styles["submit-btn"]}
            >
              <FaGoogle style={{ marginRight: "8px" }} />
              Sign Up with Google
            </button>

            <button
              onClick={handleGitHubSignUp}
              className={styles["submit-btn"]}
            >
              <FaGithub style={{ marginRight: "8px" }} />
              Sign Up with GitHub
            </button>
          </div>

          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
