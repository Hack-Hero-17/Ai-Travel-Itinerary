// Import necessary functions from Firebase SDK
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification, // Add createUserWithEmailAndPassword import for SignUp
  signInWithPopup, // Add signInWithPopup import for Google sign-in
  GoogleAuthProvider,
  GithubAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth"; // Add the necessary authentication methods
import { getAnalytics } from "firebase/analytics";

// Your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjJsLu3bskSAJSmii-gsuQS8TFOZJqR3Q",
  authDomain: "ai-travel-itinerary-9873f.firebaseapp.com",
  projectId: "ai-travel-itinerary-9873f",
  storageBucket: "ai-travel-itinerary-9873f.firebasestorage.app",
  messagingSenderId: "322461228222",
  appId: "1:322461228222:web:eab25139d064874cf792ef",
  measurementId: "G-MZTS0TPYHR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Initialize Google Auth Provider (if needed)
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// Initialize Firebase Analytics
const analytics = getAnalytics(app);

// Export required functionalities
export {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword, // Export this for Sign-Up
  signInWithPopup, // Export this for Google Sign-In
  googleProvider,
  githubProvider,
  analytics,
  sendPasswordResetEmail,
  sendEmailVerification,
};
