import React, { useState } from "react";
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

export default function TambahDataScreen({ navigation }) {
  const [komoditas, setKomoditas] = useState("");
  const [kategoriDipilih, setKategoriDipilih] = useState([]); // sekarang array (multi select)
  const [harga, setHarga] = useState("");
  const [satuan, setSatuan] = useState("");
  const [pasar, setPasar] = useState("Ngadiprono");
  const [alamat, setAlamat] = useState("Yogyakarta");

  const [modalKategoriVisible, setModalKategoriVisible] = useState(false);
  const [modalKomoditasVisible, setModalKomoditasVisible] = useState(false);
  const [searchKategori, setSearchKategori] = useState("");
  const [searchKomoditas, setSearchKomoditas] = useState("");

  // 🔹 Data kategori dan komoditas
  const dataKategori = [
    "Gula",
    "Minyak",
    "Ikan",
    "Buah",
    "Sayur",
    "Daging",
    "Telur",
    "Beras",
    "Kopi",
    "Teh",
    "Rempah",
  ];

  const dataKomoditas = {
    Gula: ["Gula Merah", "Gula Pasir"],
    Minyak: ["Minyak Kelapa", "Minyak Sawit"],
    Ikan: ["Ikan Lele", "Ikan Tuna", "Ikan Nila"],
    Buah: ["Apel", "Jeruk", "Pisang", "Mangga"],
    Sayur: ["Bayam", "Kangkung", "Wortel", "Tomat"],
    Daging: ["Daging Ayam", "Daging Sapi"],
    Telur: ["Telur Ayam", "Telur Bebek"],
    Beras: ["Beras Putih", "Beras Merah"],
    Kopi: ["Kopi Robusta", "Kopi Arabika"],
    Teh: ["Teh Hijau", "Teh Hitam"],
    Rempah: ["Lada", "Kunyit", "Jahe", "Ketumbar"],
  };

  const filteredKategori = dataKategori.filter((item) =>
    item.toLowerCase().includes(searchKategori.toLowerCase())
  );

  // 🔹 gabungkan semua komoditas dari kategori yang dipilih
  const filteredKomoditas = kategoriDipilih.length
    ? kategoriDipilih
        .flatMap((kategori) => dataKomoditas[kategori] || [])
        .filter((item) => item.toLowerCase().includes(searchKomoditas.toLowerCase()))
    : [];

  const handleSelectKategori = (item) => {
    if (kategoriDipilih.includes(item)) {
      setKategoriDipilih(kategoriDipilih.filter((i) => i !== item));
    } else {
      setKategoriDipilih([...kategoriDipilih, item]);
    }
  };

  const handleSubmit = () => {
    if (kategoriDipilih.length === 0 || !komoditas || !harga || !satuan) {
      Alert.alert("Peringatan", "Semua field wajib diisi!");
      return;
    }

    const data = {
      kategori: kategoriDipilih,
      komoditas,
      harga,
      satuan,
      pasar,
      alamat,
    };

    console.log("Data tersimpan:", data);
    Alert.alert("Berhasil", "Data berhasil disimpan!");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* 🔹 Header */}
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

      {/* 🔹 Form */}
      <ScrollView contentContainerStyle={styles.container}>
        {/* 🔸 KATEGORI */}
        <Text style={styles.label}>Kategori</Text>
        <TouchableOpacity
          style={styles.dropdownHeader}
          onPress={() => setModalKategoriVisible(true)}
        >
          <Text
            style={{ color: kategoriDipilih.length ? "#000" : "#9CA3AF", flex: 1 }}
          >
            {kategoriDipilih.length
              ? kategoriDipilih.join(", ")
              : "Pilih kategori"}
          </Text>
          <Ionicons name="chevron-down" size={18} color="#174A6A" />
        </TouchableOpacity>

        {/* 🔸 KOMODITAS */}
        <Text style={styles.label}>Nama Komoditas</Text>
        <TouchableOpacity
          style={styles.dropdownHeader}
          onPress={() => {
            if (kategoriDipilih.length === 0) {
              Alert.alert("Peringatan", "Pilih kategori terlebih dahulu!");
              return;
            }
            setModalKomoditasVisible(true);
          }}
        >
          <Text style={{ color: komoditas ? "#000" : "#9CA3AF", flex: 1 }}>
            {komoditas || "Pilih komoditas"}
          </Text>
          <Ionicons name="chevron-down" size={18} color="#174A6A" />
        </TouchableOpacity>

        {/* 🔸 Harga & Satuan */}
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.label}>Harga</Text>
            <TextInput
              style={styles.input}
              placeholder="Rp."
              keyboardType="numeric"
              value={harga}
              onChangeText={setHarga}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Satuan</Text>
            <TextInput
              style={styles.input}
              placeholder="Kg / Liter / Ekor"
              value={satuan}
              onChangeText={setSatuan}
            />
          </View>
        </View>

        {/* 🔸 Pasar */}
        <Text style={styles.label}>Nama Pasar</Text>
        <TextInput style={styles.input} value={pasar} onChangeText={setPasar} />

        <Text style={styles.label}>Alamat Pasar</Text>
        <TextInput style={styles.input} value={alamat} onChangeText={setAlamat} />

        {/* 🔸 Tombol Simpan */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Simpan</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 🔹 Modal Pilih Kategori (MULTI SELECT) */}
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
            <ScrollView
              style={{ maxHeight: 300 }}
              showsVerticalScrollIndicator={true}
            >
              {filteredKategori.map((item) => {
                const selected = kategoriDipilih.includes(item);
                return (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.optionItem,
                      selected && styles.optionActive,
                    ]}
                    onPress={() => handleSelectKategori(item)}
                  >
                    <Ionicons
                      name={selected ? "checkbox" : "square-outline"}
                      size={20}
                      color="#174A6A"
                      style={{ marginRight: 10 }}
                    />
                    <Text style={styles.optionText}>{item}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <TouchableOpacity
              onPress={() => setModalKategoriVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeText}>Selesai</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 🔹 Modal Pilih Komoditas */}
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
            <ScrollView
              style={{ maxHeight: 300 }}
              showsVerticalScrollIndicator={true}
            >
              {filteredKomoditas.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.optionItem,
                    item === komoditas && styles.optionActive,
                  ]}
                  onPress={() => {
                    setKomoditas(item);
                    setModalKomoditasVisible(false);
                  }}
                >
                  <Text style={styles.optionText}>{item}</Text>
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
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  optionText: {
    color: "#333",
  },
  optionActive: {
    backgroundColor: "#E6F0F6",
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
