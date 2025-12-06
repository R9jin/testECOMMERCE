import { useContext } from "react";
import { useParams } from "react-router-dom";
import ProductDetails from "../components/ProductDetails";
import { ProductsContext } from "../context/ProductsContext";

function ProductDetailsPage() {
  const { id } = useParams();
  const { products, loading } = useContext(ProductsContext);

  if (loading) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>
        Loading product...
      </h2>
    );
  }

  // ✅ FIX: Compare 'p.product_id' (the string ID "AP001") 
  // with the 'id' from the URL (which is also "AP001").
  // Previously it was checking p.id (which is the database integer 1, 2, 3...)
  const product = products.find((p) => p.product_id === id);

  if (!product) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>
        Product not found
      </h2>
    );
  }

  // Pass the found product to the details component
  return <ProductDetails product={{ ...product, image: product.image_url }} />;
}

export default ProductDetailsPage;