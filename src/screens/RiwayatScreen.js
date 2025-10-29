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
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function RiwayatScreen({ navigation }) {
  const [search, setSearch] = useState("");
  const [selectedTab, setSelectedTab] = useState("Semua");
  const [filterVisible, setFilterVisible] = useState(false);
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const kategori = ["Semua", "Sayuran", "Daging", "Ikan", "Buah", "Telur"];

  const dataRiwayat = [
    {
      id: 1,
      nama: "Daging Ayam",
      harga: "Rp. 15.000/kg",
      tanggal: "10 Okt 2025, 08.00 WIB",
      gambar: "https://cdn-icons-png.flaticon.com/512/3069/3069179.png",
      status: "upload",
      kategori: "Daging",
    },
    {
      id: 2,
      nama: "Tomat",
      harga: "Rp. 10.000/kg",
      tanggal: "10 Okt 2025, 08.00 WIB",
      gambar: "https://cdn-icons-png.flaticon.com/512/415/415682.png",
      status: "hapus",
      kategori: "Sayuran",
    },
    {
      id: 3,
      nama: "Ikan Nila",
      harga: "Rp. 25.000/kg",
      tanggal: "11 Okt 2025, 10.30 WIB",
      gambar: "https://cdn-icons-png.flaticon.com/512/616/616408.png",
      status: "edit",
      kategori: "Ikan",
    },
  ];

  // ✅ Format tanggal seperti "1 Jan 2002"
  const formatDate = (tgl) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    return tgl.toLocaleDateString("id-ID", options).replace(/\./g, "");
  };

  const getStatusIcon = (status) => {
    if (status === "upload")
      return <Text style={[styles.statusText, { color: "#22C55E" }]}>Sinkron</Text>;
    if (status === "hapus")
      return <Text style={[styles.statusText, { color: "#EF4444" }]}>Hapus</Text>;
    if (status === "edit")
      return <Text style={[styles.statusText, { color: "#FACC15" }]}>Edit</Text>;
    return null;
  };

  // 🔍 FILTER BERDASARKAN SEARCH, STATUS, DAN KATEGORI
  const filteredData = dataRiwayat.filter((item) => {
    const cocokSearch = item.nama.toLowerCase().includes(search.toLowerCase());
    const cocokStatus =
      filterStatus === "Semua" ? true : item.status === filterStatus;
    const cocokKategori =
      selectedTab === "Semua" ? true : item.kategori === selectedTab;
    return cocokSearch && cocokStatus && cocokKategori;
  });

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <LinearGradient colors={["#174A6A", "#0B3B53"]} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Riwayat</Text>
          <TouchableOpacity onPress={() => setFilterVisible(true)}>
            <Ionicons name="filter-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* SEARCH */}
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
          <TouchableOpacity
            style={styles.filterBox}
            onPress={() => setDatePickerVisible(true)}
          >
            <Ionicons name="calendar-outline" size={16} color="#174A6A" />
            <Text style={styles.filterText}>{formatDate(selectedDate)}</Text>
          </TouchableOpacity>

          <View style={styles.filterBox}>
            <Ionicons name="cube-outline" size={16} color="#174A6A" />
            <Text style={styles.filterText}>Total : {filteredData.length}</Text>
          </View>
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
      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <View key={item.id} style={styles.card}>
              <Image source={{ uri: item.gambar }} style={styles.image} />
              <View style={styles.cardContent}>
                <Text style={styles.itemName}>{item.nama}</Text>
                <Text style={styles.itemPrice}>{item.harga}</Text>
                <Text style={styles.itemDate}>{item.tanggal}</Text>
              </View>
              <View style={styles.iconRight}>{getStatusIcon(item.status)}</View>
            </View>
          ))
        ) : (
          <Text style={{ textAlign: "center", marginTop: 20, color: "#6B7280" }}>
            Tidak ada data ditemukan
          </Text>
        )}
      </ScrollView>

      {/* MODAL FILTER STATUS */}
      <Modal
        visible={filterVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFilterVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setFilterVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter Riwayat</Text>
            {["Semua", "upload", "edit", "hapus"].map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterOption,
                  filterStatus === status && styles.filterOptionActive,
                ]}
                onPress={() => {
                  setFilterStatus(status);
                  setFilterVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.filterOptionText,
                    filterStatus === status && { color: "#fff" },
                  ]}
                >
                  {status === "upload"
                    ? "Sinkron"
                    : status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* DATE PICKER */}
      {datePickerVisible && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="spinner"
          onChange={(event, date) => {
            if (date) setSelectedDate(date);
            setDatePickerVisible(false);
          }}
        />
      )}
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
  // MODAL FILTER
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: { fontSize: 16, fontWeight: "700", marginBottom: 10, color: "#174A6A" },
  filterOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: "#E0F2FE",
  },
  filterOptionActive: { backgroundColor: "#174A6A" },
  filterOptionText: { color: "#174A6A", fontWeight: "600" },
});
