import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { 
    getDatabase,
    saveMarket, 
} from "../../config/database"; // pastikan path ini sesuai

export default function TambahDataScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [commodities, setCommodities] = useState([]);
  const [filteredCommodities, setFilteredCommodities] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCommodity, setSelectedCommodity] = useState(null);
  const [unit, setUnit] = useState("");
  const [price, setPrice] = useState("");
  const [market, setMarket] = useState("");
  const [location, setLocation] = useState("");

  const [modalKategoriVisible, setModalKategoriVisible] = useState(false);
  const [modalKomoditasVisible, setModalKomoditasVisible] = useState(false);
  const [searchKategori, setSearchKategori] = useState("");
  const [searchKomoditas, setSearchKomoditas] = useState("");

  // ================== INIT DATA ==================
  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    try {
      const db = await getDatabase();

      const categoriesResult = await db.getAllAsync("SELECT * FROM categories;");
      const commoditiesResult = await db.getAllAsync("SELECT * FROM commodities;");

      setCategories(categoriesResult);
      setCommodities(commoditiesResult);
      const storedMarket = await AsyncStorage.getItem("market_name");
      const storedLocation = await AsyncStorage.getItem("market_location");
      setMarket(storedMarket || "Tidak diketahui");
      setLocation(storedLocation || "-");
    } catch (error) {
      console.log("initData error:", error);
    }
  };

  // ================== HANDLER ==================
  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setSelectedCommodity(null);
    setUnit("");

    const filtered = commodities.filter(
      (c) => c.category_id === category.id
    );
    setFilteredCommodities(filtered);
  };

  const handleSelectCommodity = (commodity) => {
    setSelectedCommodity(commodity);
    setUnit(commodity.unit);
  };

  const handleSubmit = async () => {
    if (!selectedCategory || !selectedCommodity || !price) {
      Alert.alert("Peringatan", "Semua field wajib diisi!");
      return;
    }

    try {
      const db = await getDatabase();
      db.transaction(
        (tx) => {
          tx.executeSql(
            "INSERT INTO prices (commodity_id, price, date, status) VALUES (?, ?, datetime('now'), 'pending');",
            [selectedCommodity.id, price]
          );
        },
        (error) => {
          console.log("Error inserting price:", error);
          Alert.alert("Gagal", "Gagal menyimpan data!");
        },
        () => {
          Alert.alert("Berhasil", "Data harga berhasil disimpan offline!");
          setPrice("");
          setSelectedCategory(null);
          setSelectedCommodity(null);
          setUnit("");
        }
      );
    } catch (error) {
      console.log("Submit error:", error);
    }
  };

  // ================== FILTER ==================
  const filteredCategories = categories.filter((c) =>
    c.name_category.toLowerCase().includes(searchKategori.toLowerCase())
  );

  const filteredComs = filteredCommodities.filter((c) =>
    c.name_commodity.toLowerCase().includes(searchKomoditas.toLowerCase())
  );

  // ================== UI ==================
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tambah Data</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Kategori */}
        <Text style={styles.label}>Kategori</Text>
        <TouchableOpacity
          style={styles.dropdownHeader}
          onPress={() => setModalKategoriVisible(true)}
        >
          <Text
            style={{
              color: selectedCategory ? "#000" : "#9CA3AF",
              flex: 1,
            }}
          >
            {selectedCategory ? selectedCategory.name_category : "Pilih kategori"}
          </Text>
          <Ionicons name="chevron-down" size={18} color="#174A6A" />
        </TouchableOpacity>

        {/* Komoditas */}
        <Text style={styles.label}>Nama Komoditas</Text>
        <TouchableOpacity
          style={styles.dropdownHeader}
          onPress={() => {
            if (!selectedCategory) {
              Alert.alert("Peringatan", "Pilih kategori terlebih dahulu!");
              return;
            }
            setModalKomoditasVisible(true);
          }}
        >
          <Text
            style={{
              color: selectedCommodity ? "#000" : "#9CA3AF",
              flex: 1,
            }}
          >
            {selectedCommodity
              ? selectedCommodity.name_commodity
              : "Pilih komoditas"}
          </Text>
          <Ionicons name="chevron-down" size={18} color="#174A6A" />
        </TouchableOpacity>

        {/* Harga & Satuan */}
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.label}>Harga</Text>
            <TextInput
              style={styles.input}
              placeholder="Rp."
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Satuan</Text>
            <TextInput
              style={[styles.input, { backgroundColor: "#f0f0f0" }]}
              value={unit}
              editable={false}
            />
          </View>
        </View>

        {/* Pasar */}
        <Text style={styles.label}>Nama Pasar</Text>
        <TextInput
          style={[styles.input, { backgroundColor: "#f0f0f0" }]}
          value={market}
          editable={false}
        />

        <Text style={styles.label}>Alamat Pasar</Text>
        <TextInput
          style={[styles.input, { backgroundColor: "#f0f0f0" }]}
          value={location}
          editable={false}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Simpan</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal Pilih Kategori */}
      <Modal
        visible={modalKategoriVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalKategoriVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Pilih Kategori</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Cari kategori..."
              value={searchKategori}
              onChangeText={setSearchKategori}
            />
            <ScrollView style={{ maxHeight: 300 }}>
              {filteredCategories.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.optionItem}
                  onPress={() => {
                    handleSelectCategory(item);
                    setModalKategoriVisible(false);
                  }}
                >
                  <Text style={styles.optionText}>{item.name_category}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              onPress={() => setModalKategoriVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Pilih Komoditas */}
      <Modal
        visible={modalKomoditasVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalKomoditasVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Pilih Komoditas</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Cari komoditas..."
              value={searchKomoditas}
              onChangeText={setSearchKomoditas}
            />
            <ScrollView style={{ maxHeight: 300 }}>
              {filteredComs.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.optionItem}
                  onPress={() => {
                    handleSelectCommodity(item);
                    setModalKomoditasVisible(false);
                  }}
                >
                  <Text style={styles.optionText}>{item.name_commodity}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              onPress={() => setModalKomoditasVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#174A6A",
    paddingVertical: 16,
    paddingHorizontal: 22,
  },
  backButton: {
    marginTop: 20,
    marginRight: 24,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 20,
  },
  container: {
    padding: 22,
    paddingBottom: 40,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#174A6A",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fff",
  },
  dropdownHeader: {
    borderWidth: 1,
    borderColor: "#174A6A",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#174A6A",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#174A6A",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#174A6A",
    marginBottom: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#174A6A",
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  optionItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  optionText: {
    color: "#333",
  },
  closeButton: {
    marginTop: 10,
    alignItems: "center",
  },
  closeText: {
    color: "#174A6A",
    fontWeight: "600",
  },
});
