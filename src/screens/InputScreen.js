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
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function TambahDataScreen({ navigation }) {
  const [komoditas, setKomoditas] = useState("");
  const [kategori, setKategori] = useState("");
  const [harga, setHarga] = useState("");
  const [satuan, setSatuan] = useState("");
  const [pasar, setPasar] = useState("Ngadiprono");
  const [alamat, setAlamat] = useState("Yogyakarta");

  const handleSubmit = () => {
    if (!komoditas || !kategori || !harga || !satuan) {
      Alert.alert("Peringatan", "Semua field wajib diisi!");
      return;
    }

    const data = {
      komoditas,
      kategori,
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
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tambah Data</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* 🔹 Form Input */}
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Nama Komoditas</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan nama komoditas"
          value={komoditas}
          onChangeText={setKomoditas}
        />

        <Text style={styles.label}>Kategori</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan kategori"
          value={kategori}
          onChangeText={setKategori}
        />

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

        <Text style={styles.label}>Nama Pasar</Text>
        <TextInput style={styles.input} value={pasar} onChangeText={setPasar} />

        <Text style={styles.label}>Alamat Pasar</Text>
        <TextInput
          style={styles.input}
          value={alamat}
          onChangeText={setAlamat}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Simpan</Text>
        </TouchableOpacity>
      </ScrollView>
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
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
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
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fff",
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
});
