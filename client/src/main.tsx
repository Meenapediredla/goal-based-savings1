import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { initAPI } from "./api/api";
import App from "./App";
import "./index.css";

const root = document.getElementById("root")!;

function showBootError(message: string) {
  root.innerHTML = `
    <div style="font-family:system-ui;padding:2rem;max-width:32rem;margin:4rem auto;text-align:center">
      <h1 style="font-size:1.25rem;margin-bottom:0.5rem">Could not start app</h1>
      <p style="color:#64748b;font-size:0.9rem">${message}</p>
    </div>`;
}

initAPI()
  .then(() => {
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    );
  })
  .catch((err) => {
    console.error(err);
    showBootError("Failed to connect API configuration.");
  });
