// config/api.js
const BASE_URL = "http://103.100.27.57:5000/api"; // ganti IP sesuai server kamu

export default {
  BASE_URL,
  LOGIN: `${BASE_URL}/users/login`,
  DASHBOARD: `${BASE_URL}/dashboard`,
  CATEGORIES: `${BASE_URL}/categories`,
  COMMODITIES: `${BASE_URL}/commodities`,
  ADD_PRICE: `${BASE_URL}/prices/add`,
  UPDATE_PASSWORD: `${BASE_URL}/users/update-password`, // 🔑 endpoint ubah kata sandi
};

// Ambil data dashboard
export const getDashboard = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/dashboard`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("❌ Gagal ambil dashboard:", err);
    return null;
  }
};

// 🔐 Fungsi ubah kata sandi
export const updatePassword = async (token, oldPassword, newPassword) => {
  try {
    const response = await fetch(`${BASE_URL}/users/update-password`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ Gagal update password:", error);
    return null;
  }
};
