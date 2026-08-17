import {
  useState,
  useEffect
}
from "react";

import { CartContext } from "./contexts";

const STORAGE_KEY = "munchbox-cart";

/* Load from localStorage up front so the first
   render does not save an empty cart over it */

const loadCart = () => {

  try{

    const saved =
    localStorage.getItem(STORAGE_KEY);

    return saved
      ? JSON.parse(saved)
      : [];

  }

  catch(error){

    console.log(error);

    return [];

  }

};

const CartProvider = ({children}) => {

  const [cartItems,setCartItems] =
  useState(loadCart);

  useEffect(()=>{

    localStorage.setItem(

      STORAGE_KEY,

      JSON.stringify(cartItems)

    );

  },[cartItems]);

  /* ADD
     Note: the functional update is required, otherwise
     two quick clicks lose one of the items. */

  const addToCart =
  (product)=>{

    setCartItems((prev)=>{

      const existing =
      prev.find(
        item => item._id === product._id
      );

      if(existing){

        return prev.map(item =>

          item._id === product._id

          ? {
              ...item,
              quantity: item.quantity + 1
            }

          : item

        );

      }

      return [
        ...prev,
        {
          ...product,
          quantity:1
        }
      ];

    });

  };

  /* QUANTITY CHANGE */

  const updateQuantity =
  (id, change)=>{

    setCartItems((prev)=>

      prev.map(item =>

        item._id === id

        ? {
            ...item,
            quantity:
            Math.max(1, item.quantity + change)
          }

        : item

      )

    );

  };

  /* REMOVE */

  const removeFromCart =
  (id)=>{

    setCartItems((prev)=>

      prev.filter(
        item => item._id !== id
      )

    );

  };

  /* CLEAR */

  const clearCart = () =>
    setCartItems([]);

  /* TOTAL */

  const totalPrice =
  cartItems.reduce(

    (acc,item)=>

      acc +
      Number(item.price) *
      item.quantity,

    0

  );

  const totalItems =
  cartItems.reduce(

    (acc,item)=>
      acc + item.quantity,

    0

  );

  return(

    <CartContext.Provider

      value={{

        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalPrice,
        totalItems

      }}

    >

      {children}

    </CartContext.Provider>

  );

};

export default CartProvider;
