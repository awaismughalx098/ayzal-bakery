import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import Cart from "./pages/Cart";
import OrderPage from "./pages/OrderPage";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import { CATEGORIES } from "./data/menu";

function App(){

  return(

    <Routes>

      <Route
        path="/"
        element={<Home />}
      />

      {/* MENU CATEGORIES — generated from menu.js */}

      {
        CATEGORIES.map((cat) => (

          <Route
            key={cat.slug}
            path={cat.path}
            element={<CategoryPage slug={cat.slug} />}
          />

        ))
      }

      <Route
        path="/order"
        element={<OrderPage />}
      />

      <Route
        path="/cart"
        element={<Cart />}
      />

      <Route
        path="/adminlogin"
        element={<AdminLogin />}
      />

      {/* Typing /admin in the URL will not open it —
          the token is verified with the server first */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        }
      />

      {/* OLD BAKERY LINKS -> HOME */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>

  );

}

export default App;
