import "./Categories.css";

import {
  GiCakeSlice,
  GiCupcake,
  GiCookie
} from "react-icons/gi";

import { FaIceCream } from "react-icons/fa";

import { useNavigate } from "react-router-dom";

const Categories = () => {

  const navigate = useNavigate();

  const data = [

    {
      title: "Cakes",
      icon: <GiCakeSlice />,
      path: "/cakes"
    },

    {
      title: "Desserts",
      icon: <FaIceCream />,
      path: "/desserts"
    },

    {
      title: "Cupcakes",
      icon: <GiCupcake />,
      path: "/cakes"
    },

    {
      title: "Cookies",
      icon: <GiCookie />,
      path: "/cookies"
    },

    {
      title: "Biscuits",
      icon: <GiCookie />,
      path: "/biscuits"
    }

  ];

  return (

    <section
      className="categories container"
      id="categories"
    >

      <h2>Our Categories</h2>

      <div className="category-grid">

        {
          data.map((item, index) => (

            <button
              className="category-card"
              key={index}
              onClick={() => navigate(item.path)}
            >

              <div className="icon">
                {item.icon}
              </div>

              <h3>{item.title}</h3>

            </button>

          ))
        }

      </div>

    </section>

  );
};

export default Categories;