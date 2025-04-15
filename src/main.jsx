import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import GeminiChat from "./GeminiChat.jsx";
import ViewChat from "./ViewChat.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GeminiChat />} />
        <Route path="/chat/:chatId" element={<ViewChat />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
