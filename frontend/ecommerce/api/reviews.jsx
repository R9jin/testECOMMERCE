const API_BASE_URL = "http://127.0.0.1:8000/api";

export async function getReviews(productId) {
    const res = await fetch(`${API_BASE_URL}/reviews/${productId}`);
    return res.json();
    }

    export async function submitReview(reviewData, token) {
    const res = await fetch(`${API_BASE_URL}/reviews`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reviewData),
    });
    return res.json();
    }