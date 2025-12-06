import { useContext, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useAuth } from "../context/AuthContext";
import { ProductsContext } from "../context/ProductsContext";
import styles from "../styles/AdminDashboard.module.css";

export default function AdminDashboardPage() {
  const { token } = useAuth();
  const { products, addProductAPI, updateProductAPI, deleteProductAPI } = useContext(ProductsContext);

  const [form, setForm] = useState({
    id: "",
    name: "",
    category: "",
    price: "",
    stock: "",
    rating: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      }
    },
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const buildFormData = (isUpdate = false) => {
    const fd = new FormData();
    if (isUpdate) fd.append("_method", "PUT"); // Laravel reads this
    fd.append("name", form.name);
    fd.append("category", form.category);
    fd.append("price", form.price);
    fd.append("stock", form.stock);
    fd.append("rating", form.rating);
    fd.append("description", form.description);
    if (imageFile) fd.append("image", imageFile);
    return fd;
  };




  const resetForm = () => {
    setForm({ id: "", name: "", category: "", price: "", stock: "", rating: "", description: "" });
    setImageFile(null);
    setImagePreview(null);
    setIsEditing(false);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      alert("Image is required.");
      return;
    }
    setLoadingAction(true);
    try {
      const formData = buildFormData(false); // false = POST
      await addProductAPI(formData, token);
      alert("Product added successfully!");
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Failed to add product.");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setLoadingAction(true);
    try {
      const res = await updateProductAPI(form.id, buildFormData(true), token);

      if (res.success) {
        alert("Product updated!"); // Only alert if backend says success
        resetForm();
      } else {
        console.error(res);
        alert("Failed to update product."); // backend responded but with error
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update product."); // network or JS error
    } finally {
      setLoadingAction(false);
    }
  };




  const handleEdit = (product) => {
    setIsEditing(true);
    setForm(product);
    setImagePreview(product.image_url);
    setImageFile(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    setLoadingAction(true);
    try {
      await deleteProductAPI(id, token);
    } catch (err) {
      console.error(err);
      alert("Failed to delete product.");
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div className={styles.adminDashboard}>
      <h1>Admin Dashboard</h1>

      <form className={styles.addForm} onSubmit={isEditing ? handleUpdateProduct : handleAddProduct}>
        <div className={styles.dropzone} {...getRootProps()}>
            <input {...getInputProps()} />
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className={styles.preview} />
            ) : (
              <p>Drag & drop image here, or click to upload</p>
            )}
          </div>
        <input name="name" placeholder="Food Name" value={form.name} onChange={handleChange} required />

        <select name="category" value={form.category} onChange={handleChange} required>
          <option value="">Select Category</option>
          <option value="Appetizers">Appetizers</option>
          <option value="Main Course">Main Course</option>
          <option value="Desserts">Desserts</option>
          <option value="Street Food">Street Food</option>
          <option value="Drinks">Drinks</option>
        </select>

        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
        <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} />
        <input name="rating" type="number" min="0" max="5" step="0.1" placeholder="Rating (0-5)" value={form.rating} onChange={handleChange} />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />

        <button type="submit" disabled={loadingAction}>
          {loadingAction ? "Processing..." : isEditing ? "Update Product" : "Add Product"}
        </button>

        {isEditing && <button type="button" className={styles.cancelBtn} onClick={resetForm}>Cancel</button>}
      </form>

      <h2>All Products</h2>

      <div className={styles.tableWrapper}>
        <table className={styles.productsTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Img</th>
              <th>Name</th>
              <th>Cat</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Rating</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>
                  <img
                    src={p.image_file_name ? `/assets/${p.image_file_name}` : p.image_url}
                    alt={p.name}
                    className={styles.thumb}
                    onError={(e) => {
                      e.onerror = null;
                      e.src = p.image_url;
                    }}
                  />
                </td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>₱{p.price}</td>
                <td>{p.stock}</td>
                <td>{p.rating}</td>
                <td>
                  <button className={styles.editBtn} onClick={() => handleEdit(p)}>Edit</button>
                  <button className={styles.deleteBtn} onClick={() => handleDelete(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
