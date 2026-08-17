import "./Cart.css";

import { useContext } from "react";

import { useNavigate } from "react-router-dom";

import {
  FaTrash,
  FaShoppingBasket,
  FaMinus,
  FaPlus
} from "react-icons/fa";

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Seo from "../seo/Seo";

import { CartContext } from "../context/contexts";
import { imageUrl } from "../api";

const Cart = () => {

  const navigate = useNavigate();

  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    totalPrice,
    totalItems
  } = useContext(CartContext);

  return (

    <>

      <Seo page="cart" />

      <Navbar />

      <div className="cart-page">

        <div className="cart-header">

          <div className="container">

            <span>Your Order</span>

            <h1>Munch Box Cart</h1>

            <p>
              {
                cartItems.length === 0
                  ? "Your cart is empty."
                  : `${cartItems.length} item${cartItems.length > 1 ? "s" : ""} ready to order`
              }
            </p>

          </div>

        </div>

        <div className="container cart-container">

          {

            cartItems.length === 0

              ? (

                <div className="empty-cart">

                  <FaShoppingBasket />

                  <h2>Cart Is Empty</h2>

                  <p>
                    Add something from the menu to place an order.
                  </p>

                  <button
                    className="btn-primary"
                    onClick={() => navigate("/burgers")}
                  >
                    Browse Menu
                  </button>

                </div>

              )

              : (

                <div className="cart-layout">

                  <div className="cart-items">

                    {

                      cartItems.map((item) => (

                        <div
                          className="cart-card"
                          key={item._id}
                        >

                          <img
                            src={imageUrl(item.image)}
                            alt={item.title}
                          />

                          <div className="cart-info">

                            <h3>{item.title}</h3>

                            <p className="cart-line-price">
                              Rs {item.price * item.quantity}
                              <small>
                                (Rs {item.price} each)
                              </small>
                            </p>

                            <div className="cart-qty-control">

                              <button
                                onClick={() =>
                                  updateQuantity(item._id, -1)
                                }
                                aria-label="Decrease quantity"
                              >
                                <FaMinus />
                              </button>

                              <strong>{item.quantity}</strong>

                              <button
                                onClick={() =>
                                  updateQuantity(item._id, 1)
                                }
                                aria-label="Increase quantity"
                              >
                                <FaPlus />
                              </button>

                            </div>

                          </div>

                          <button
                            className="remove-btn"
                            onClick={() =>
                              removeFromCart(item._id)
                            }
                            aria-label={`Remove ${item.title}`}
                          >
                            <FaTrash />
                          </button>

                        </div>

                      ))

                    }

                  </div>

                  <div className="cart-summary">

                    <h2>Bill Summary</h2>

                    <div className="summary-row">
                      <span>Items</span>
                      <span>{totalItems}</span>
                    </div>

                    <div className="summary-row">
                      <span>Subtotal</span>
                      <span>Rs {totalPrice}</span>
                    </div>

                    <div className="summary-row">
                      <span>Delivery</span>
                      <span className="free-tag">
                        Ask on call
                      </span>
                    </div>

                    <div className="summary-total">
                      <span>Total</span>
                      <strong>Rs {totalPrice}</strong>
                    </div>

                    <button
                      className="btn-primary summary-btn"
                      onClick={() =>
                        navigate("/order", {
                          state:{
                            fromCart: true,

                            /* Send every line separately. This used
                               to send only totalPrice and the summed
                               quantity, which the order page then
                               multiplied together again. */

                            items: cartItems.map((item) => ({
                              title: item.title,
                              price: Number(item.price),
                              quantity: item.quantity,
                              image: item.image
                            })),

                            image: cartItems[0].image
                          }
                        })
                      }
                    >
                      Proceed To Order
                    </button>

                    <button
                      className="summary-link"
                      onClick={() => navigate("/burgers")}
                    >
                      Add more items
                    </button>

                  </div>

                </div>

              )

          }

        </div>

      </div>

      <Footer />

    </>

  );

};

export default Cart;
