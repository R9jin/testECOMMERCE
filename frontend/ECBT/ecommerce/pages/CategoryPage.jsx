import React, { useState, useContext } from "react";
import { ProductsContext } from "../context/ProductsContext";
import ProductCard from "../components/ProductCard";
import styles from "../styles/CategoryPage.module.css";

/**
 * CategoryPage Component
 *
 * Displays products grouped by category with filtering and sorting options.
 * Each product is duplicated to match HomePage styling.
 */
function CategoryPage() {
  const { products } = useContext(ProductsContext);

  const [sortOption, setSortOption] = useState("default");
  const [priceRange, setPriceRange] = useState("all");
  const [minRating, setMinRating] = useState("all");

  // Filter and sort helper function
  const filterAndSort = (list) => {
    let filtered = [...list];

    // Convert numeric strings to numbers
    filtered = filtered.map((p) => ({
      ...p,
      price: Number(p.price),
      rating: Number(p.rating),
    }));

    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number);
      filtered = filtered.filter((p) => p.price >= min && p.price <= max);
    }

    if (minRating !== "all") {
      filtered = filtered.filter((p) => p.rating >= Number(minRating));
    }

    if (sortOption === "price-asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-desc") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortOption === "newest") {
      filtered.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    }

    return filtered;
  };

  const categories = [
    { id: "appetizers", title: "APPETIZERS", items: filterAndSort(products.filter((p) => p.category === "Appetizers")) },
    { id: "main-course", title: "MAIN COURSE", items: filterAndSort(products.filter((p) => p.category === "Main Course")) },
    { id: "desserts", title: "DESSERTS", items: filterAndSort(products.filter((p) => p.category === "Desserts")) },
    { id: "street-foods", title: "STREET FOODS", items: filterAndSort(products.filter((p) => p.category === "Street Food")) },
    { id: "drinks", title: "DRINKS", items: filterAndSort(products.filter((p) => p.category === "Drinks")) },
  ];



  return (
    <main className={styles.homepage}>
      {/* FILTER BAR */}
      <div className={styles.filterBar}>
        <div className={styles.filterItem}>
          <label>Sort By:</label>
          <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option value="default">Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest Arrivals</option>
          </select>
        </div>

        <div className={styles.filterItem}>
          <label>Price Range:</label>
          <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
            <option value="all">All</option>
            <option value="0-100">₱0 - ₱100</option>
            <option value="100-300">₱100 - ₱300</option>
            <option value="300-500">₱300 - ₱500</option>
            <option value="500-9999">₱500+</option>
          </select>
        </div>

        <div className={styles.filterItem}>
          <label>Rating:</label>
          <select value={minRating} onChange={(e) => setMinRating(e.target.value)}>
            <option value="all">All</option>
            <option value="3">3★ & up</option>
            <option value="4">4★ & up</option>
            <option value="5">5★ only</option>
          </select>
        </div>
      </div>

      {/* CATEGORY SECTIONS */}
      {categories.map((cat) => (
        <section key={cat.id} id={cat.id} className={styles.categorySection}>
          <h2>{cat.title}</h2>
          <div className={styles.productList}>
            {cat.items.map((item) => (
              <React.Fragment key={item.id}>
                <ProductCard product={{ ...item, image: item.image_url }} />
                <ProductCard product={{ ...item, image: item.image_url }} />
              </React.Fragment>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}

export default CategoryPage;
