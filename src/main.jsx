<<<<<<< HEAD
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ExpenseTracker from './ExpenseTracker.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ExpenseTracker/>
  </StrictMode>,
)
=======
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import GeminiChat from "./GeminiChat.jsx";
import ViewChat from "./ViewChat.jsx";
import Dashboard from "./Dashboard.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/new" element={<GeminiChat />} />
        <Route path="/chat/:chatId" element={<ViewChat />} />
      </Routes>
    </BrowserRouter>
  // </StrictMode>
);
>>>>>>> d55efa29daa0488f1cbf3a855f128799bee46197
