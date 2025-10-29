import * as SQLite from "expo-sqlite";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";
const BASE_URL = api.BASE_URL;

let db; // jangan langsung buka di luar fungsi!

// 🔹 Inisialisasi database
export const initDatabase = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync("local_market.db");
  }

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY,
      name_category TEXT
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS commodities (
      id INTEGER PRIMARY KEY,
      name_commodity TEXT,
      category_id INTEGER,
      unit TEXT,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS markets (
      id INTEGER PRIMARY KEY,
      name_market TEXT,
      location TEXT
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS prices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      commodity_id INTEGER,
      market_id INTEGER,
      price REAL,
      synced INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (commodity_id) REFERENCES commodities(id),
      FOREIGN KEY (market_id) REFERENCES markets(id)
    );
  `);

  console.log("✅ Database & tabel lokal siap digunakan");
};

export const getDatabase = () => {
  if (!db) {
    throw new Error("Database belum diinisialisasi. Panggil initDatabase() dulu.");
  }
  return db;
};

export const syncFromServer = async () => {
  try {
    console.log("📡 Memulai sinkronisasi dari server...");

    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("Token tidak ditemukan di AsyncStorage");

    console.log("🔑 Token ditemukan:", token.substring(0, 15) + "...");
    console.log("🌐 BASE_URL:", BASE_URL);

    const categoriesURL = api.CATEGORIES;
    const commoditiesURL = api.COMMODITIES;

    console.log("📥 Fetching data kategori dari:", categoriesURL);
    console.log("📥 Fetching data komoditas dari:", commoditiesURL);

    const [catRes, comRes] = await Promise.all([
      fetch(categoriesURL, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(commoditiesURL, { headers: { Authorization: `Bearer ${token}` } }),
    ]);

    console.log("📊 Status respons:", catRes.status, comRes.status);

    if (!catRes.ok || !comRes.ok) {
      throw new Error(`Server error: ${catRes.status} / ${comRes.status}`);
    }

    const categories = await catRes.json();
    const commodities = await comRes.json();

    console.log("📦 Jumlah kategori:", categories.length);
    console.log("📦 Jumlah komoditas:", commodities.length);
    console.log("🧩 Contoh data commodities:", commodities[0]);

    await db.execAsync("DELETE FROM categories;");
    await db.execAsync("DELETE FROM commodities;");

    for (const cat of categories) {
      await db.runAsync(
        `INSERT INTO categories (id, name_category) VALUES (?, ?);`,
        [cat.id, cat.name_category]
      );
    }

    for (const com of commodities) {
      const categoryId = com.category_id || com.category?.id || null;
      await db.runAsync(
        `INSERT INTO commodities (id, name_commodity, category_id, unit)
         VALUES (?, ?, ?, ?);`,
        [com.id, com.name_commodity, categoryId, com.unit]
      );
    }

    console.log("✅ Data kategori & komoditas berhasil disinkronkan ke lokal");
  } catch (err) {
    console.error("❌ Gagal sync data:", err);
  }
};



// 🔹 Simpan data pasar user (dari dashboard)
export const saveMarket = async (market) => {
  if (!db) return console.warn("⚠️ Database belum diinisialisasi");

  await db.execAsync("DELETE FROM markets;");
  await db.runAsync(
    `INSERT INTO markets (id, name_market, location) VALUES (?, ?, ?);`,
    [market.id, market.name_market, market.location]
  );

  console.log("✅ Data pasar disimpan lokal");
};


// 🔹 Simpan input harga (offline)
export const savePrice = async (commodityId, marketId, price) => {
  if (!db) return console.warn("⚠️ Database belum diinisialisasi");

  try {
    await db.runAsync(
      `INSERT INTO prices (commodity_id, market_id, price, synced) VALUES (?, ?, ?, 0);`,
      [commodityId, marketId, price]
    );
    console.log("✅ Harga tersimpan lokal");
  } catch (err) {
    console.error("❌ Gagal simpan harga:", err);
  }
};

// 🔹 Ambil data kategori
export const getCategories = async () => {
  const result = await db.getAllAsync(`SELECT * FROM categories;`);
  return result;
};

// 🔹 Ambil komoditas berdasarkan kategori
export const getCommoditiesByCategory = async (categoryId) => {
  const result = await db.getAllAsync(
    `SELECT * FROM commodities WHERE category_id = ?;`,
    [categoryId]
  );
  return result;
};

// 🔹 Ambil pasar user
export const getMarket = async () => {
  const result = await db.getAllAsync(`SELECT * FROM markets LIMIT 1;`);
  return result.length ? result[0] : null;
};

// 🔹 Sinkronisasi data harga lokal ke server
export const syncPricesToServer = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("Token tidak ditemukan");

    const unsynced = await db.getAllAsync(
      `SELECT * FROM prices WHERE synced = 0;`
    );

    for (const item of unsynced) {
      const res = await fetch(api.PRICES, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commodity_id: item.commodity_id,
          market_id: item.market_id,
          price: item.price,
        }),
      });

      if (res.ok) {
        await db.runAsync(`UPDATE prices SET synced = 1 WHERE id = ?;`, [
          item.id,
        ]);
      }
    }

    console.log("✅ Semua data harga lokal berhasil disinkronkan");
  } catch (err) {
    console.error("❌ Gagal sync harga:", err);
  }
};
