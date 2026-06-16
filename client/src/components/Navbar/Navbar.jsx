import "./Navbar.css";

import {
  FaShoppingCart,
  FaUser
}
from "react-icons/fa";

import {
  Link,
  useNavigate
}
from "react-router-dom";

import {
  useContext
}
from "react";

import {
  CartContext
}
from "../../context/CartContext";

/* LOGO */

import logo
from "../../assets/logo.png";

const Navbar = () => {

  const navigate =
  useNavigate();

  const {
    cartItems
  } = useContext(CartContext);

  return(

    <nav className="navbar">

      {/* LOGO */}

      <div
        className="logo-section"
        onClick={()=>navigate("/")}
      >

        <img
          src={logo}
          alt="AYZAL"
          className="nav-logo"
        />

        <div className="logo-text">

          <h2>
            AYZAL
          </h2>

          <span>
            Baking Studio
          </span>

        </div>

      </div>

      {/* LINKS */}

      <ul className="nav-links">

        <li>
          <Link to="/">
            Home
          </Link>
        </li>

        <li>
          <Link to="/cakes">
            Cakes
          </Link>
        </li>

        <li>
          <Link to="/desserts">
            Desserts
          </Link>
        </li>

        <li>
          <Link to="/brownies">
            Brownies
          </Link>
        </li>

        <li>
          <Link to="/cookies">
            Cookies
          </Link>
        </li>

      </ul>

      {/* ICONS */}

      <div className="nav-icons">

        {/* ADMIN */}

        <div
          className="nav-icon-box"
          onClick={()=>
            navigate("/adminlogin")
          }
        >

          <FaUser />

        </div>

        {/* CART */}

        <div
          className="nav-icon-box cart-icon"
          onClick={()=>
            navigate("/cart")
          }
        >

          <FaShoppingCart />

          {
            cartItems.length > 0 && (

              <span className="cart-count">

                {cartItems.length}

              </span>

            )
          }

        </div>

      </div>

    </nav>

  );

};

export default Navbar;