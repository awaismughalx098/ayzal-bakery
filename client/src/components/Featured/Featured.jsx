import "./Featured.css";

import { useNavigate } from "react-router-dom";

import {
  useEffect,
  useState,
  useMemo,
  useContext
} from "react";

import { FaPlus } from "react-icons/fa";

import ProductImage from "../ProductImage/ProductImage";
import { CartContext } from "../../context/contexts";
import { useProducts } from "../../hooks/useProducts";

const PICK_COUNT = 4;

const Featured = () => {

  const navigate = useNavigate();

  const { addToCart } = useContext(CartContext);

  const { products: allProducts, loading } = useProducts();

  /* Bumped on a timer to move the window along */

  const [rotation, setRotation] = useState(0);

  /* Show a window of PICK_COUNT items that walks
     through the full list, so every product gets
     its turn instead of repeating at random. */

  const products = useMemo(() => {

    if(allProducts.length <= PICK_COUNT)
      return allProducts;

    const start =
      (rotation * PICK_COUNT) % allProducts.length;

    return Array.from(
      { length: PICK_COUNT },
      (_, i) => allProducts[(start + i) % allProducts.length]
    );

  }, [allProducts, rotation]);

  useEffect(() => {

    if(allProducts.length <= PICK_COUNT)
      return;

    const interval = setInterval(() => {

      setRotation((r) => r + 1);

    }, 6000);

    return () => clearInterval(interval);

  }, [allProducts]);

  /* Nothing added yet — hide the whole section
     instead of showing an empty row. */

  if(loading || products.length === 0){
    return null;
  }

  return (

    <section className="featured">

      <div className="container">

        <div className="section-head-line">

          <span>Customer Favourites</span>

          <h2>Most Ordered</h2>

          <p>
            The items our customers order the most.
          </p>

        </div>

        <div className="featured-grid">

          {
            products.map((item) => (

              <div
                className="product-card"
                key={item._id}
              >

                <div className="product-image">

                  <ProductImage
                    src={item.image}
                    alt={item.title}
                  />

                  <button
                    className="quick-add"
                    onClick={() => addToCart(item)}
                    aria-label={`Add ${item.title} to cart`}
                  >
                    <FaPlus />
                  </button>

                </div>

                <div className="product-content">

                  <h3>{item.title}</h3>

                  {
                    item.description && (
                      <p className="product-desc">
                        {item.description}
                      </p>
                    )
                  }

                  <div className="product-foot">

                    <span className="product-price">
                      Rs {item.price}
                    </span>

                    <button
                      onClick={() =>
                        navigate("/order", { state:item })
                      }
                    >
                      Order Now
                    </button>

                  </div>

                </div>

              </div>

            ))
          }

        </div>

      </div>

    </section>

  );

};

export default Featured;
