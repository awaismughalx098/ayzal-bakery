import {
  Routes,
  Route
}
from "react-router-dom";
import Admin from "./pages/Admin";
import Home
from "./pages/Home";

import Cakes
from "./pages/Cakes";

import Desserts
from "./pages/Desserts";

import Brownies
from "./pages/Brownies";

import Cookies
from "./pages/Cookies";

import Cart
from "./pages/Cart";
import AdminLogin
from "./pages/AdminLogin";

function App(){

  return(

    <Routes>

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/cakes"
        element={<Cakes />}
      />

      <Route
        path="/desserts"
        element={<Desserts />}
      />

      <Route
        path="/brownies"
        element={<Brownies />}
      />

      <Route
        path="/cookies"
        element={<Cookies />}
      />

      <Route
        path="/cart"
        element={<Cart />}
      />
      <Route
  path="/adminlogin"
  element={<AdminLogin />}
/>
<Route
  path="/admin"
  element={<Admin />}
/>
    </Routes>

  );

}

export default App;