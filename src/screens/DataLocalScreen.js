import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function DataLocalScreen({ navigation }) {
  const [search, setSearch] = useState("");
  const [selectedTab, setSelectedTab] = useState("Semua");
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const kategori = ["Semua", "Sayuran", "Daging", "Ikan", "Buah", "Telur"];

  const [dataKomoditas, setDataKomoditas] = useState([
    {
      id: 1,
      nama: "Daging Ayam",
      harga: "Rp. 15.000/kg",
      tanggal: "10 Okt 2025, 08.00 WIB",
      gambar: "https://cdn-icons-png.flaticon.com/512/3069/3069179.png",
    },
    {
      id: 2,
      nama: "Tomat",
      harga: "Rp. 10.000/kg",
      tanggal: "10 Okt 2025, 08.00 WIB",
      gambar: "https://cdn-icons-png.flaticon.com/512/415/415682.png",
    },
    {
      id: 3,
      nama: "Ikan Lele",
      harga: "Rp. 20.000/kg",
      tanggal: "10 Okt 2025, 08.00 WIB",
      gambar: "https://cdn-icons-png.flaticon.com/512/616/616408.png",
    },
  ]);

  // === PILIH SEMUA / BATAL PILIH ===
  const handleSelectAll = () => {
    if (selectedItems.length === dataKomoditas.length) {
      setSelectedItems([]); // batal pilih semua
      setIsSelectionMode(false);
    } else {
      setSelectedItems(dataKomoditas.map((item) => item.id)); // pilih semua
      setIsSelectionMode(true);
    }
    setMenuVisible(false);
  };

  // === HAPUS SEMUA TERPILIH ===
  const handleDelete = () => {
    const newData = dataKomoditas.filter(
      (item) => !selectedItems.includes(item.id)
    );
    setDataKomoditas(newData);
    setSelectedItems([]);
    setIsSelectionMode(false);
  };

  // === TEKAN SATU ITEM ===
  const toggleSelectItem = (id) => {
    let updated;
    if (selectedItems.includes(id)) {
      updated = selectedItems.filter((itemId) => itemId !== id);
    } else {
      updated = [...selectedItems, id];
    }
    setSelectedItems(updated);

    if (updated.length === 0) setIsSelectionMode(false);
  };

  const handleSync = () => {
    alert("🔄 Data lokal sedang disinkronkan ke server...");
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <LinearGradient colors={["#174A6A", "#0B3B53"]} style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Daftar Komoditas Lokal</Text>
          <TouchableOpacity onPress={() => setMenuVisible(true)}>
            <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* POPUP MENU */}
        <Modal
          transparent
          visible={menuVisible}
          animationType="fade"
          onRequestClose={() => setMenuVisible(false)}
        >
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPressOut={() => setMenuVisible(false)}
          >
            <View style={styles.menuContainer}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                  navigation.navigate("Riwayat");
                }}
              >
                <Text style={styles.menuText}>Riwayat</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={handleSelectAll}>
                <Text style={styles.menuText}>
                  {selectedItems.length === dataKomoditas.length
                    ? "Batal pilih semua"
                    : "Pilih semua"}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

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
            <Text style={styles.filterText}>Total : {dataKomoditas.length}</Text>
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

      {/* LIST KOMODITAS */}
      <ScrollView
        style={styles.listContainer}
        showsVerticalScrollIndicator={false}
      >
        {dataKomoditas.map((item) => {
          const selected = selectedItems.includes(item.id);
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() => {
                if (isSelectionMode) toggleSelectItem(item.id);
              }}
              onLongPress={() => {
                setIsSelectionMode(true);
                toggleSelectItem(item.id);
              }}
              delayLongPress={300}
            >
              <Image source={{ uri: item.gambar }} style={styles.image} />
              <View style={styles.cardContent}>
                <Text style={styles.itemName}>{item.nama}</Text>
                <Text style={styles.itemPrice}>{item.harga}</Text>
                <Text style={styles.itemDate}>{item.tanggal}</Text>
              </View>

              {selected && (
                <Ionicons
                  name="checkmark-circle"
                  size={22}
                  color="#16A34A"
                  style={{ alignSelf: "center" }}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* TOMBOL HAPUS (MUNCUL KALAU ADA YANG TERPILIH) */}
      {selectedItems.length > 0 && (
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={18} color="#fff" />
          <Text style={styles.deleteText}>Hapus</Text>
        </TouchableOpacity>
      )}

      {/* TOMBOL SINKRON */}
      <TouchableOpacity style={styles.syncButton} onPress={handleSync}>
        <Ionicons name="sync-outline" size={18} color="#fff" />
        <Text style={styles.syncText}>Sinkron</Text>
      </TouchableOpacity>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Dashboard")}
        >
          <Ionicons name="home-outline" size={24} color="#6B7280" />
          <Text style={styles.navText}>Beranda</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="folder" size={24} color="#174A6A" />
          <Text style={[styles.navText, styles.navTextActive]}>
            Data Lokal
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Profile")}
        >
          <Ionicons name="person-outline" size={24} color="#6B7280" />
          <Text style={styles.navText}>Profil</Text>
        </TouchableOpacity>
      </View>
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
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.1)", alignItems: "flex-end" },
  menuContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 70,
    marginRight: 15,
    paddingVertical: 6,
    width: 150,
    elevation: 5,
  },
  menuItem: { paddingVertical: 10, paddingHorizontal: 16 },
  menuText: { fontSize: 14, color: "#333" },
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
  filterRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
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
  listContainer: { padding: 16, marginBottom: 80 },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 12,
    padding: 10,
    elevation: 1,
  },
  image: { width: 60, height: 60, borderRadius: 8, marginRight: 10 },
  cardContent: { flex: 1 },
  itemName: { fontSize: 15, fontWeight: "700", color: "#111827" },
  itemPrice: { fontSize: 14, color: "#174A6A", fontWeight: "600" },
  itemDate: { fontSize: 12, color: "#6B7280" },
  deleteButton: {
    position: "absolute",
    bottom: 135,
    right: 20,
    backgroundColor: "#EF4444",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  deleteText: { color: "#fff", fontWeight: "700", marginLeft: 6 },
  syncButton: {
    position: "absolute",
    bottom: 80,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#174A6A",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  syncText: { color: "#fff", fontWeight: "700", marginLeft: 6 },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderTopColor: "#E5E7EB",
    borderTopWidth: 1,
  },
  navItem: { alignItems: "center" },
  navText: { fontSize: 12, color: "#6B7280", marginTop: 3 },
  navTextActive: { color: "#174A6A", fontWeight: "bold" },
});
