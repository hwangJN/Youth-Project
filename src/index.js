import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import ScrollToTop from "./components/ScrollToTop";

import { BrowserRouter, HashRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ScrollToTop />
    <App />
  </BrowserRouter>
);
