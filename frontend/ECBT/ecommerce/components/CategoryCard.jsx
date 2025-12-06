import { Link } from "react-router-dom";
import styles from "../styles/CategoryCards.module.css";

function CategoryCards() {
  const categories = [
    { name: "Appetizers", img: `${process.env.PUBLIC_URL}/assets/appetizers/dynamite-lumpia.jpeg` },
    { name: "Main Course", img: `${process.env.PUBLIC_URL}/assets/mainCourse/chicken-adobo.jpeg` },
    { name: "Desserts", img: `${process.env.PUBLIC_URL}/assets/desserts/leche-flan.jpg` },
    { name: "Street Foods", img: `${process.env.PUBLIC_URL}/assets/streetFoods/bananacue.jpg` },
    { name: "Drinks", img: `${process.env.PUBLIC_URL}/assets/drinks/bukoPandan.jpg` }
  ];

  return (
    <div className={styles.categoryContainer}>
      <h2 className={styles.categoryTitle}>CATEGORIES</h2>
      <div className={styles.categoryGrid}>
        {categories.map((cat) => (
          <Link
            key={cat.name}
            to={`/category#${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
            className={styles.categoryCard}
          >
            <div className={styles.imagePlaceholder}>
              <img src={cat.img} alt={cat.name} />
            </div>
            <p>{cat.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CategoryCards;
