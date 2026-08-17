import "./OrderPage.css";

import {
  useState,
  useContext
} from "react";

import {
  useLocation,
  useNavigate
} from "react-router-dom";

import {
  FaMinus,
  FaPlus,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaWhatsapp
} from "react-icons/fa";

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Seo from "../seo/Seo";

import { api, errorMessage } from "../api";
import ProductImage from "../components/ProductImage/ProductImage";
import { BRAND } from "../data/menu";
import { CartContext } from "../context/contexts";

/* Turn a value like "Rs. 1,234" into a number */

const toNumber = (value) => {
  const n = Number(
    String(value ?? "")
      .replace(/rs\.?/gi, "")
      .replace(/,/g, "")
      .trim()
  );

  return Number.isFinite(n) ? n : 0;
};

const OrderPage = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const { clearCart } = useContext(CartContext);

  const product = location.state;

  /* Order from the cart = several lines.
     Order from the menu = one item + quantity stepper. */

  const isCartOrder =
    Boolean(product?.fromCart) &&
    Array.isArray(product?.items) &&
    product.items.length > 0;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [instructions, setInstructions] = useState("");

  const [quantity, setQuantity] = useState(
    Math.max(1, Number(product?.quantity) || 1)
  );

  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  /* ---------- NO PRODUCT ---------- */

  if(!product){

    return (

      <>

        <Seo page="order" />

        <Navbar />

        <section className="order-page">

          <div className="container">

            <div className="order-empty">

              <h1>No Item Selected</h1>

              <p>
Choose an item from the menu first,
                then place your order.
              </p>

              <button
                className="btn-primary"
                onClick={() => navigate("/burgers")}
              >
                Browse Menu
              </button>

            </div>

          </div>

        </section>

        <Footer />

      </>

    );

  }

  /* ---------- PRICING ---------- */

  const lines = isCartOrder
    ? product.items.map((item) => {

        const price = toNumber(item.price);
        const qty = Math.max(1, Number(item.quantity) || 1);

        return {
          title: item.title,
          price,
          quantity: qty,
          lineTotal: price * qty
        };

      })
    : [];

  const unitPrice = isCartOrder
    ? 0
    : toNumber(product.price);

  /* A cart order totals every line.
     A single order is unit price x quantity. */

  const total = isCartOrder
    ? lines.reduce((sum, line) => sum + line.lineTotal, 0)
    : unitPrice * quantity;

  const totalPieces = isCartOrder
    ? lines.reduce((sum, line) => sum + line.quantity, 0)
    : quantity;

  const heading = isCartOrder
    ? `Cart Order (${lines.length} item${lines.length > 1 ? "s" : ""})`
    : product.title || product.name;

  /* ---------- SUBMIT ---------- */

  const handleSubmit = async (e) => {

    e.preventDefault();

    setSending(true);

    /* The server calculates the total itself, so we
       send only the line data and never a total. */

    const orderData = isCartOrder
      ? {
          customerName: name,
          phone,
          address,
          instructions,
          items: lines.map(({ title, price, quantity }) => ({
            title,
            price,
            quantity
          }))
        }
      : {
          customerName: name,
          phone,
          address,
          instructions,
          product: heading,
          price: unitPrice,
          quantity
        };

    try{

      await api.post("/orders", orderData);

      setDone(true);

      if(isCartOrder){
        clearCart();
      }

      setName("");
      setPhone("");
      setAddress("");
      setInstructions("");

      window.scrollTo({ top:0, behavior:"smooth" });

    }

    catch(error){

      alert(
        errorMessage(
          error,
          "Could not place the order. Please call us instead: " +
          BRAND.phone
        )
      );

    }

    finally{

      setSending(false);

    }

  };

  return (

    <>

      <Seo page="order" />

      <Navbar />

      <section className="order-page">

        <div className="container">

          {
            done && (

              <div className="order-success">

                <h2>Order Confirmed 🎉</h2>

                <p>
                  Thank you! We will call you shortly
                  to confirm your order.
                </p>

                <div className="order-success-actions">

                  <button
                    className="btn-primary"
                    onClick={() => navigate("/")}
                  >
                    Back To Home
                  </button>

                  <a
                    className="order-wa"
                    href={`https://wa.me/${BRAND.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaWhatsapp />
                    WhatsApp Us
                  </a>

                </div>

              </div>

            )
          }

          <div className="order-container">

            {/* ---------- LEFT: ITEM ---------- */}

            <div className="order-summary-side">

              <div className="order-image">

                <ProductImage
                  src={product.image}
                  alt={heading}
                  loading="eager"
                />

              </div>

              <div className="order-item-box">

                <h1>{heading}</h1>

                {
                  !isCartOrder && product.description && (
                    <p className="order-item-desc">
                      {product.description}
                    </p>
                  )
                }

                {/* CART LINES */}

                {
                  isCartOrder && (

                    <ul className="order-lines">

                      {
                        lines.map((line) => (

                          <li key={line.title}>

                            <span className="order-line-name">
                              {line.title}
                              <small>
                                Rs {line.price} × {line.quantity}
                              </small>
                            </span>

                            <span className="order-line-total">
                              Rs {line.lineTotal}
                            </span>

                          </li>

                        ))
                      }

                    </ul>

                  )
                }

                {/* QUANTITY — single item orders only */}

                {
                  !isCartOrder && (

                    <div className="qty-row">

                      <span>Quantity</span>

                      <div className="qty-control">

                        {/* Functional update, otherwise two quick
                            clicks lose one of the increments */}

                        <button
                          type="button"
                          onClick={() =>
                            setQuantity(
                              (q) => Math.max(1, q - 1)
                            )
                          }
                          aria-label="Decrease quantity"
                        >
                          <FaMinus />
                        </button>

                        <strong>{quantity}</strong>

                        <button
                          type="button"
                          onClick={() =>
                            setQuantity(
                              (q) => Math.min(100, q + 1)
                            )
                          }
                          aria-label="Increase quantity"
                        >
                          <FaPlus />
                        </button>

                      </div>

                    </div>

                  )
                }

                <div className="order-total-row">

                  <span>
                    Total
                    <small>
                      {totalPieces} item{totalPieces > 1 ? "s" : ""}
                    </small>
                  </span>

                  <strong>Rs {total}</strong>

                </div>

                <div className="order-contact-note">

                  <p>
                    <FaMapMarkerAlt />
                    {BRAND.address}
                  </p>

                  <p>
                    <FaPhoneAlt />
                    {BRAND.phone}
                  </p>

                </div>

              </div>

            </div>

            {/* ---------- RIGHT: FORM ---------- */}

            <div className="order-content">

              <span className="order-tag">
                Checkout
              </span>

              <h2>Delivery Details</h2>

              <p className="order-sub">
                Fill in your details and we will call
                to confirm.
              </p>

              <form
                className="order-form"
                onSubmit={handleSubmit}
              >

                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />

                <input
                  type="text"
                  placeholder="Delivery Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />

                <textarea
                  placeholder="Special Instructions (extra spicy, no mayo...)"
                  value={instructions}
                  onChange={(e) =>
                    setInstructions(e.target.value)
                  }
                />

                <button
                  type="submit"
                  className="btn-primary order-submit"
                  disabled={sending}
                >
                  {
                    sending
                      ? "Placing Order..."
                      : `Confirm Order — Rs ${total}`
                  }
                </button>

              </form>

            </div>

          </div>

        </div>

      </section>

      <Footer />

    </>

  );

};

export default OrderPage;
