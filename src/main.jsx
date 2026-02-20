// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AppProvider } from "./state/AppContext";
import { IndicatorProvider } from "./state/IndicatorContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppProvider>
      <IndicatorProvider>
        <App />
      </IndicatorProvider>
    </AppProvider>
  </React.StrictMode>
);

