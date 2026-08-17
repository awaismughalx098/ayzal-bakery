import React from "react";

import ReactDOM from "react-dom/client";

/* THEME — must load before everything else */

import "./styles/global.css";

import {
  BrowserRouter
}
from "react-router-dom";

import App from "./App.jsx";

import AuthProvider
from "./context/AuthContext.jsx";

import CartProvider
from "./context/CartContext.jsx";

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <React.StrictMode>

    <BrowserRouter>

      <AuthProvider>

        <CartProvider>

          <App />

        </CartProvider>

      </AuthProvider>

    </BrowserRouter>

  </React.StrictMode>

);
