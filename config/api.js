// frontend/config/api.js
const BASE_URL = 'http://103.100.27.57:5000/api'; // ganti IP kamu di sini

export default {
  BASE_URL,
  LOGIN: `${BASE_URL}/users/login`,
  // nanti bisa tambahkan endpoint lain di sini:
  // GET_MARKET: ${BASE_URL}/markets,
  // ADD_PRICE: ${BASE_URL}/prices/add,
};