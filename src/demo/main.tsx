import React from "react";
import ReactDOM from "react-dom/client";
import "../styles/index.css";
import "./demo.css";
import App from "./App.tsx";

const languageDefaultVersion = "dara-ui-language-default-fa-v1";

try {
  if (localStorage.getItem(languageDefaultVersion) !== "1") {
    localStorage.setItem("dara-ui-language", "fa");
    localStorage.setItem(languageDefaultVersion, "1");
  }
} catch {
  // storage unavailable
}

if (window.matchMedia("(max-width: 767px)").matches) {
  window.history.scrollRestoration = "manual";

  if (!window.location.hash) {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
