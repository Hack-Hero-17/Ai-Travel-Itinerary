import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import LoginPage from "./Auth/LoginPage.jsx";
import SignUpPage from "./Auth/SignUpPage.jsx";
import ForgotPasswordPage from "./Auth/ForgotPasswordPage.jsx";
import GeminiChat from "./GeminiChat.jsx";
import ViewChat from "./ViewChat.jsx";
import ExpenseTracker from "./Expense/ExpenseTracker.jsx";
import Dashboard from "./Dashboard.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      <Route path="/new" element={<GeminiChat />} />
      <Route path="/chat/:chatId" element={<ViewChat />} />
      {/* <Route path="/login" element={<LoginPage />} /> */}
      <Route path="/expenses" element={<ExpenseTracker />} />
    </Routes>
  </BrowserRouter>
  // </StrictMode>
);
