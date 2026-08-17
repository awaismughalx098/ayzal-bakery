import "./Navbar.css";

import {
  FaShoppingCart,
  FaUser,
  FaBars,
  FaTimes,
  FaPhoneAlt
} from "react-icons/fa";

import {
  NavLink,
  useNavigate
} from "react-router-dom";

import {
  useContext,
  useEffect,
  useState
} from "react";

import {
  CartContext
} from "../../context/contexts";

import {
  BRAND,
  CATEGORIES
} from "../../data/menu";

/* LOGO */

import logo
from "../../assets/logo.png";

const Navbar = () => {

  const navigate = useNavigate();

  const {
    totalItems
  } = useContext(CartContext);

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* Shrink the bar once the page scrolls */

  useEffect(() => {

    const onScroll = () =>
      setScrolled(window.scrollY > 40);

    onScroll();

    window.addEventListener("scroll", onScroll);

    return () =>
      window.removeEventListener("scroll", onScroll);

  }, []);

  const go = (path) => {
    setOpen(false);
    navigate(path);
  };

  return (

    <nav
      className={
        scrolled
          ? "navbar scrolled"
          : "navbar"
      }
    >

      <div className="nav-inner container">

        {/* LOGO */}

        <div
          className="logo-section"
          onClick={() => go("/")}
        >

          <img
            src={logo}
            alt={BRAND.name}
            className="nav-logo"
          />

          <div className="logo-text">

            <h2>
              {BRAND.name}
            </h2>

            <span>
              {BRAND.tagline}
            </span>

          </div>

        </div>

        {/* LINKS */}

        <ul
          className={
            open
              ? "nav-links open"
              : "nav-links"
          }
        >

          <li>
            <NavLink
              to="/"
              onClick={() => setOpen(false)}
            >
              Home
            </NavLink>
          </li>

          {
            CATEGORIES.map((cat) => (

              <li key={cat.slug}>
                <NavLink
                  to={cat.path}
                  onClick={() => setOpen(false)}
                >
                  {cat.name}
                </NavLink>
              </li>

            ))
          }

          <li className="nav-call-mobile">
            <a href={`tel:${BRAND.phoneDial}`}>
              <FaPhoneAlt />
              Call Now
            </a>
          </li>

        </ul>

        {/* ICONS */}

        <div className="nav-icons">

          <a
            href={`tel:${BRAND.phoneDial}`}
            className="nav-call"
          >
            <FaPhoneAlt />
            Call Now
          </a>

          {/* ADMIN */}

          <button
            className="nav-icon-box"
            onClick={() => go("/adminlogin")}
            aria-label="Admin login"
          >
            <FaUser />
          </button>

          {/* CART */}

          <button
            className="nav-icon-box cart-icon"
            onClick={() => go("/cart")}
            aria-label="Cart"
          >

            <FaShoppingCart />

            {
              totalItems > 0 && (

                <span className="cart-count">
                  {totalItems}
                </span>

              )
            }

          </button>

          {/* MOBILE TOGGLE */}

          <button
            className="nav-toggle"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <FaTimes /> : <FaBars />}
          </button>

        </div>

      </div>

    </nav>

  );

};

export default Navbar;
