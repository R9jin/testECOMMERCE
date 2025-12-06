import React, { useContext } from "react";
import { ProductsContext } from "../context/ProductsContext";
import CategoryCards from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";
import styles from "../styles/HomePage.module.css";

function HomePage() {
  const { products, loading } = useContext(ProductsContext);

  // Show loading while products are fetching
  if (loading) return <p>Loading products...</p>;

  // Ensure products is an array
  if (!Array.isArray(products) || products.length === 0) {
    return <p>No products available.</p>;
  }

  // Top 5 featured products (rating >= 4)
  const featured = products.filter((p) => p.rating >= 4).slice(0, 5);

  // Top 5 best sellers (sorted by sold)
  const bestSellers = [...products].sort((a, b) => b.sold - a.sold).slice(0, 5);

  // Render each product twice (or remove duplicates if not needed)
  const renderProductDuplicates = (items) =>
    items.flatMap((item) => [
      <ProductCard key={item.id + "-1"} product={item} />,
      <ProductCard key={item.id + "-2"} product={item} />,
    ]);

  return (
    <main className={styles.homepage}>
      {/* CATEGORY NAVIGATION */}
      <section>
        <CategoryCards />
      </section>

      {/* FEATURED PRODUCTS */}
      <section className={styles.categorySection}>
        <h2>FEATURED</h2>
        <div className={styles.productList}>
          {renderProductDuplicates(featured)}
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className={styles.categorySection}>
        <h2>BEST SELLERS</h2>
        <div className={styles.productList}>
          {renderProductDuplicates(bestSellers)}
        </div>
      </section>
    </main>
  );
}

export default HomePage;
