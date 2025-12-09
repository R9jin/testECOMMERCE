// src/ecommerce/utils/storage.js
export const safeParse = (key) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : [];
  } catch (e) {
    console.error(`Error parsing ${key}:`, e);
    return [];
  }
};
