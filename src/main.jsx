import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import GeminiChat from "./GeminiChat.jsx";
import ViewChat from "./ViewChat.jsx";
import Dashboard from "./Dashboard.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import ProfilePage from "./ProfilePage.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
<<<<<<< HEAD
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      <Route
        path="/new"
        element={
          <ProtectedRoute>
            <GeminiChat />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat/:chatId"
        element={
          <ProtectedRoute>
            <ViewChat />
          </ProtectedRoute>
        }
      />
      {/* <Route path="/login" element={<LoginPage />} /> */}
      {/* <Route path="/expenses" element={<ExpenseTracker />} /> */}
      <Route
        path="/expenses"
        element={
          <ProtectedRoute>
            <ExpenseTracker />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  </BrowserRouter>
=======
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/new" element={<GeminiChat />} />
        <Route path="/chat/:chatId" element={<ViewChat />} />
      </Routes>
    </BrowserRouter>
>>>>>>> parent of c304085 (All Pages, Authentication added)
  // </StrictMode>
);
