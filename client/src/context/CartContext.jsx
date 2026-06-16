import {
  createContext,
  useState,
  useEffect
}
from "react";

export const CartContext =
createContext();

const CartProvider = ({children}) => {

  const [cartItems,setCartItems] =
  useState([]);

  useEffect(()=>{

    const savedCart =
    localStorage.getItem(
      "ayzal-cart"
    );

    if(savedCart){

      setCartItems(
        JSON.parse(savedCart)
      );

    }

  },[]);

  useEffect(()=>{

    localStorage.setItem(

      "ayzal-cart",

      JSON.stringify(cartItems)

    );

  },[cartItems]);

  /* ADD */

  const addToCart =
  (product)=>{

    const existing =
    cartItems.find(

      item =>
      item._id === product._id

    );

    if(existing){

      setCartItems(

        cartItems.map(item =>

          item._id === product._id

          ? {
              ...item,
              quantity:
              item.quantity + 1
            }

          : item

        )

      );

    }

    else{

      setCartItems([

        ...cartItems,

        {
          ...product,
          quantity:1
        }

      ]);

    }

  };

  /* REMOVE */

  const removeFromCart =
  (id)=>{

    setCartItems(

      cartItems.filter(

        item =>
        item._id !== id

      )

    );

  };

  /* TOTAL */

  const totalPrice =
  cartItems.reduce(

    (acc,item)=>

      acc +
      item.price *
      item.quantity,

    0

  );

  return(

    <CartContext.Provider

      value={{

        cartItems,
        addToCart,
        removeFromCart,
        totalPrice

      }}

    >

      {children}

    </CartContext.Provider>

  );

};

export default CartProvider;