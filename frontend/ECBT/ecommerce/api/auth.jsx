const API_BASE_URL = "http://127.0.0.1:8000/api";

export async function register(user) {
  const res = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  return res.json();
}

export async function login(credentials) {
  const res = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return res.json();
}

export async function getUser(token) {
  const res = await fetch(`${API_BASE_URL}/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}
