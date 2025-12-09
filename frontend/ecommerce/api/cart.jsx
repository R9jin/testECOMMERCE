const API_BASE_URL = "http://127.0.0.1:8000/api";

export async function getCart(token) {
  const res = await fetch(`${API_BASE_URL}/cart`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function addToCart(productId, token) {
  const res = await fetch(`${API_BASE_URL}/cart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ product_id: productId }),
  });
  return res.json();
}

export async function removeFromCart(cartId, token) {
  const res = await fetch(`${API_BASE_URL}/cart/${cartId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}
