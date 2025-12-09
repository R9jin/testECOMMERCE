const API_BASE_URL = "http://127.0.0.1:8000/api";

export async function getWishlist(token) {
  const res = await fetch(`${API_BASE_URL}/wishlist`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function addToWishlist(productId, token) {
  const res = await fetch(`${API_BASE_URL}/wishlist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ product_id: productId }),
  });
  return res.json();
}

export async function removeFromWishlist(id, token) {
  const res = await fetch(`${API_BASE_URL}/wishlist/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}
