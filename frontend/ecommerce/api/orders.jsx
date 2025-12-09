const API_BASE_URL = "http://127.0.0.1:8000/api";

export async function getOrders(token) {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function createOrder(order, token) {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(order),
  });
  return res.json();
}
