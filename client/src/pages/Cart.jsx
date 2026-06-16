import "./Cart.css";

import {
  useContext
}
from "react";

import {
  CartContext
}
from "../context/CartContext";

import {
  useNavigate
}
from "react-router-dom";

const Cart = () => {

  const navigate =
  useNavigate();

  const {

    cartItems,
    removeFromCart,
    totalPrice

  } = useContext(CartContext);

  return(

    <div className="cart-page">

      <div className="cart-header">

        <h1>
          Your Cart
        </h1>

        <p>
          Luxury bakery selections
        </p>

      </div>

      <div className="cart-container">

        {

          cartItems.length === 0

          ? (

            <div className="empty-cart">

              <h2>
                Cart is Empty
              </h2>

            </div>

          )

          : (

            <>

              <div className="cart-items">

                {

                  cartItems.map((item)=>(

                    <div
                      className="cart-card"
                      key={item._id}
                    >

                      <img
                        src={item.image}
                        alt={item.title}
                      />

                      <div className="cart-info">

                        <h3>
                          {item.title}
                        </h3>

                        <p>
                          Rs. {item.price}
                        </p>

                        <span>
                          Qty:
                          {item.quantity}
                        </span>

                      </div>

                      <button
                        onClick={()=>
                          removeFromCart(item._id)
                        }
                      >

                        Remove

                      </button>

                    </div>

                  ))

                }

              </div>

              <div className="cart-summary">

                <h2>
                  Total Bill
                </h2>

                <h1>
                  Rs. {totalPrice}
                </h1>

                <button
                  onClick={()=>
                    navigate("/order")
                  }
                >

                  Order Now

                </button>

              </div>

            </>

          )

        }

      </div>

    </div>

  );

};

export default Cart;