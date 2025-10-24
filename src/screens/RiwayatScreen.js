import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function RiwayatScreen({ navigation }) {
  const [search, setSearch] = useState("");
  const [selectedTab, setSelectedTab] = useState("Semua");

  const kategori = ["Semua", "Sayuran", "Daging", "Ikan", "Buah", "Telur"];

  const dataRiwayat = [
    {
      id: 1,
      nama: "Daging Ayam",
      harga: "Rp. 15.000/kg",
      tanggal: "10 Okt 2025, 08.00 WIB",
      gambar: "https://cdn-icons-png.flaticon.com/512/3069/3069179.png",
      status: "upload", // hijau
    },
    {
      id: 2,
      nama: "Tomat",
      harga: "Rp. 10.000/kg",
      tanggal: "10 Okt 2025, 08.00 WIB",
      gambar: "https://cdn-icons-png.flaticon.com/512/415/415682.png",
      status: "hapus", // merah
    },
    {
      id: 3,
      nama: "Daging Ayam",
      harga: "Rp. 15.000/kg",
      tanggal: "10 Okt 2025, 08.00 WIB",
      gambar: "https://cdn-icons-png.flaticon.com/512/3069/3069179.png",
      status: "edit", // kuning
    },
  ];

  const getStatusIcon = (status) => {
    if (status === "upload")
      return <Ionicons name="cloud-upload-outline" size={20} color="#22C55E" />;
    if (status === "hapus")
      return <Ionicons name="trash-outline" size={20} color="#EF4444" />;
    if (status === "edit")
      return <Ionicons name="create-outline" size={20} color="#FACC15" />;
    return null;
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <LinearGradient colors={["#174A6A", "#0B3B53"]} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Riwayat</Text>
          <Ionicons name="filter-outline" size={22} color="#fff" />
        </View>

        {/* SEARCH BAR */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#6B7280" />
          <TextInput
            placeholder="Search"
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
          />
        </View>

        {/* FILTER ROW */}
        <View style={styles.filterRow}>
          <TouchableOpacity style={styles.filterBox}>
            <Ionicons name="calendar-outline" size={16} color="#174A6A" />
            <Text style={styles.filterText}>23/10/2025</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.filterBox}>
            <Ionicons name="cube-outline" size={16} color="#174A6A" />
            <Text style={styles.filterText}>Total : 50</Text>
          </TouchableOpacity>
        </View>

        {/* TAB KATEGORI */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tabRow}>
            {kategori.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.tabItem,
                  selectedTab === item && styles.tabActive,
                ]}
                onPress={() => setSelectedTab(item)}
              >
                <Text
                  style={[
                    styles.tabText,
                    selectedTab === item && styles.tabTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>

      {/* LIST RIWAYAT */}
      <ScrollView
        style={styles.listContainer}
        showsVerticalScrollIndicator={false}
      >
        {dataRiwayat.map((item) => (
          <View key={item.id} style={styles.card}>
            <Image source={{ uri: item.gambar }} style={styles.image} />
            <View style={styles.cardContent}>
              <Text style={styles.itemName}>{item.nama}</Text>
              <Text style={styles.itemPrice}>{item.harga}</Text>
              <Text style={styles.itemDate}>{item.tanggal}</Text>
            </View>
            <View style={styles.iconRight}>{getStatusIcon(item.status)}</View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 10,
    paddingHorizontal: 10,
    height: 40,
  },
  searchInput: { flex: 1, marginLeft: 6, color: "#111827" },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  filterBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0F2FE",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  filterText: { marginLeft: 5, color: "#174A6A", fontWeight: "600" },
  tabRow: { flexDirection: "row", marginTop: 10, paddingBottom: 4 },
  tabItem: {
    backgroundColor: "transparent",
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#fff",
  },
  tabActive: { backgroundColor: "#fff" },
  tabText: { color: "#fff", fontWeight: "500" },
  tabTextActive: { color: "#174A6A", fontWeight: "700" },
  listContainer: { padding: 16 },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
    alignItems: "center",
  },
  image: { width: 60, height: 60, borderRadius: 8, marginRight: 10 },
  cardContent: { flex: 1 },
  itemName: { fontSize: 15, fontWeight: "700", color: "#111827" },
  itemPrice: { fontSize: 14, color: "#174A6A", fontWeight: "600" },
  itemDate: { fontSize: 12, color: "#6B7280" },
  iconRight: { marginLeft: 8 },
});
