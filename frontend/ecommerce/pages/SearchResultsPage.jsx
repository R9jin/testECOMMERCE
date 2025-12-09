import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import { ProductsContext } from "../context/ProductsContext"; // ✅ use context
import ProductCard from "../components/ProductCard";
import styles from "../styles/SearchResultsPage.module.css";

function SearchResultsPage() {
  const { products } = useContext(ProductsContext); // get products from context
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get("query")?.toLowerCase() || "";

  // Filter products matching the search query
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(query)
  );

  return (
    <main className={styles.searchResultsPage}>
      <h2>Search Results for "{query}"</h2>

      {filteredProducts.length > 0 ? (
        <div className={styles.searchResultsGrid}>
          {filteredProducts.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      ) : (
        <p className={styles.noResults}>
          No products found matching "{query}".
        </p>
      )}
    </main>
  );
}

export default SearchResultsPage;
