import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import BottomNav from "../components/BottomNav";
import { getDashboard } from "../../config/api";
import {
  initDatabase,
  syncFromServer,
  saveMarket,
  debugTables,
} from "../../config/database";

export default function DashboardScreen({ navigation }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [greeting, setGreeting] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setup = async () => {
      try {
        // 🔹 1. Pastikan database lokal siap
        console.log("🔄 Inisialisasi database lokal...");
        await initDatabase();


        // 🔹 2. Ambil token user
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Kesalahan", "Token tidak ditemukan. Silakan login ulang.");
          navigation.replace("Login");
          return;
        }
        

        // 🔹 3. Sinkronisasi kategori & komoditas dari server
        console.log("🔄 Sinkronisasi data master...");
        await syncFromServer();

        // 🔹 4. Ambil data dashboard
        console.log("📡 Mengambil data dashboard...");
        const data = await getDashboard(token);

        if (data && data.success) {
          setDashboardData(data);

          // 🔹 5. Simpan data pasar user ke database lokal
          if (data.market) {
            await saveMarket(data.market);
            console.log("✅ Data pasar berhasil disimpan ke SQLite");
          }
        } else {
          console.warn("⚠️ Data dashboard tidak valid:", data);
        }

        // 🔹 6. Atur salam sesuai waktu
        const hour = new Date().getHours();
        if (hour >= 4 && hour < 11) setGreeting("Selamat Pagi");
        else if (hour >= 11 && hour < 15) setGreeting("Selamat Siang");
        else if (hour >= 15 && hour < 18) setGreeting("Selamat Sore");
        else setGreeting("Selamat Malam");
      } catch (err) {
        console.error("❌ Gagal memuat dashboard:", err);
        Alert.alert("Kesalahan", "Terjadi kesalahan saat memuat dashboard.");
      } finally {
        setLoading(false);
      }
    };

    setup();
  }, []);

  const handleTambahData = () => {
    navigation.navigate("Input");
  };

  const handleNotifikasi = () => {
    navigation.navigate("Notification");
  };

  const dataKomoditas = [
    {
      id: 1,
      nama: "Daging Ayam",
      harga: "Rp. 15.000/Kg",
      tanggal: "10 Okt 2025, 08.00 WIB",
      gambar: "https://cdn-icons-png.flaticon.com/512/3069/3069179.png",
    },
    {
      id: 2,
      nama: "Daging Sapi",
      harga: "Rp. 120.000/Kg",
      tanggal: "10 Okt 2025, 08.30 WIB",
      gambar: "https://cdn-icons-png.flaticon.com/512/1998/1998707.png",
    },
    {
      id: 3,
      nama: "Telur Ayam",
      harga: "Rp. 28.000/Kg",
      tanggal: "10 Okt 2025, 09.00 WIB",
      gambar: "https://cdn-icons-png.flaticon.com/512/616/616408.png",
    },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#174A6A" />
        <Text style={{ marginTop: 10, color: "#174A6A" }}>Memuat data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={["#174A6A", "#0B3B53"]} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>{greeting}!</Text>
            <Text style={styles.name}>
              {dashboardData?.user_name || "Nama Petugas Pasar"}
            </Text>
          </View>
          <TouchableOpacity onPress={handleNotifikasi}>
            <Ionicons name="notifications-outline" size={26} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Body */}
      <View style={styles.body}>
        <View style={styles.infoCard}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.label}>Pasar</Text>
              <Text style={styles.value}>
                {dashboardData?.market_name || "Tidak diketahui"}
              </Text>
            </View>
            <View>
              <Text style={styles.label}>Total Komoditas</Text>
              <Text style={styles.value}>
                {dashboardData?.total_commodities || 0}
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.btnTambah} onPress={handleTambahData}>
            <Text style={styles.btnText}>+ Tambah Data</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Pendataan Terakhir</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {dataKomoditas.map((item) => (
            <View key={item.id} style={styles.cardItem}>
              <Image source={{ uri: item.gambar }} style={styles.image} />
              <View style={styles.textContainer}>
                <Text style={styles.itemName}>{item.nama}</Text>
                <Text style={styles.itemPrice}>{item.harga}</Text>
                <Text style={styles.itemDate}>{item.tanggal}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      <BottomNav navigation={navigation} active="Dashboard" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },
  header: { paddingTop: 50, paddingBottom: 40, paddingHorizontal: 20 },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: { color: "#E0F2FE", fontSize: 16, fontWeight: "500" },
  name: { color: "#FFFFFF", fontSize: 18, fontWeight: "700" },
  body: {
    flex: 1,
    marginTop: -20,
    backgroundColor: "#F3F4F6",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 16,
    paddingTop: 25,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  rowBetween: { flexDirection: "row", justifyContent: "space-between" },
  label: { color: "#6B7280", fontSize: 13 },
  value: { color: "#111827", fontSize: 15, fontWeight: "600" },
  btnTambah: {
    backgroundColor: "#174A6A",
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 14,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  cardItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  image: { width: 55, height: 55, borderRadius: 10, marginRight: 12 },
  textContainer: { flex: 1 },
  itemName: { fontSize: 15, fontWeight: "700", color: "#111827" },
  itemPrice: { fontSize: 14, color: "#174A6A", fontWeight: "600" },
  itemDate: { fontSize: 12, color: "#6B7280" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
});
