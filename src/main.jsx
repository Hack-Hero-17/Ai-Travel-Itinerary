import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import GeminiChat from "./GeminiChat.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GeminiChat />
  </StrictMode>
);
