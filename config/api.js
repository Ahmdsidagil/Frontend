const BASE_URL = 'http://103.100.27.57:5000/api'; // ganti IP kamu di sini

export default {
  BASE_URL,
  LOGIN: `${BASE_URL}/users/login`,
  DASHBOARD: `${BASE_URL}/dashboard`,
  CATEGORIES: `${BASE_URL}/categories`,
  COMMODITIES: `${BASE_URL}/commodities`,
  ADD_PRICE: `${BASE_URL}/prices/add`,
  // nanti bisa tambahkan endpoint lain di sini:
  // GET_MARKET: `${BASE_URL}/markets`,
  // ADD_PRICE: `${BASE_URL}/prices/add`,
};

// config/api.js
export const getDashboard = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/dashboard`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

