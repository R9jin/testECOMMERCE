import { createContext, useEffect, useState } from "react";
import { createProduct, deleteProduct, getProducts, updateProduct } from "../api/products";
import { useAuth } from "./AuthContext";

export const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      const res = await getProducts();
      if (res.success) setProducts(res.data);
    };
    fetchAll();
  }, []);

  const addProductAPI = async (formData) => {
    const res = await createProduct(formData, token);
    if (res.success) setProducts(prev => [...prev, res.data]);
    return res;
  };

  const updateProductAPI = async (id, formData) => {
    const res = await updateProduct(id, formData, token);
    if (res.success) setProducts(prev => prev.map(p => p.id === id ? res.data : p));
    return res;
  };

  const deleteProductAPI = async (id) => {
    const res = await deleteProduct(id, token);
    if (res.success) setProducts(prev => prev.filter(p => p.id !== id));
    return res;
  };

  return (
    <ProductsContext.Provider value={{ products, addProductAPI, updateProductAPI, deleteProductAPI }}>
      {children}
    </ProductsContext.Provider>
  );
};
