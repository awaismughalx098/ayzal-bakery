import "./Categories.css";

import {
  GiHamburger,
  GiFrenchFries,
  GiChickenLeg,
  GiKetchup,
  GiSodaCan
} from "react-icons/gi";

import { useNavigate } from "react-router-dom";

import { CATEGORIES } from "../../data/menu";

/* har category slug ka icon */

const ICONS = {
  burgers: <GiHamburger />,
  fries: <GiFrenchFries />,
  wraps: <GiChickenLeg />,
  dips: <GiKetchup />,
  drinks: <GiSodaCan />
};

const Categories = () => {

  const navigate = useNavigate();

  return (

    <section
      className="categories container"
      id="categories"
    >

      <div className="category-strip">

        {
          CATEGORIES.map((cat) => (

            <button
              className="category-card"
              key={cat.slug}
              onClick={() => navigate(cat.path)}
            >

              <div className="icon">
                {ICONS[cat.slug]}
              </div>

              <h3>{cat.name}</h3>

            </button>

          ))
        }

      </div>

    </section>

  );

};

export default Categories;
