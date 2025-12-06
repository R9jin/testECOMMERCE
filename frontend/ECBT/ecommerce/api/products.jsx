const API_BASE_URL = "http://127.0.0.1:8000/api";

export async function getProducts() {
  const res = await fetch(`${API_BASE_URL}/products`);
  return res.json();
}

export async function createProduct(formData, token) {
  return fetch(`${API_BASE_URL}/products`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  }).then(res => res.json());
}

export async function updateProduct(id, formData, token) {
  return fetch(`${API_BASE_URL}/products/${id}`, {
    method: "POST", // POST instead of PUT
    headers: {
      Authorization: `Bearer ${token}`,
      // DO NOT set 'Content-Type', browser handles it for FormData
    },
    body: formData,
  }).then(res => res.json());
}

export async function deleteProduct(id, token) {
  return fetch(`${API_BASE_URL}/products/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => res.json());
}

export async function restoreProducts(token) {
  return fetch(`${API_BASE_URL}/products/restore`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => res.json());
}