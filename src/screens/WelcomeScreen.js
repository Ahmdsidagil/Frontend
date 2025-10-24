import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const GAP = 8;
const COL_WIDTH = (width - GAP * 4) / 3; // 3 kolom

const sampleImages = [
  "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce",
  "https://images.unsplash.com/photo-1506806732259-39c2d0268443",
  "https://images.unsplash.com/photo-1543353071-087092ec393b",
  "https://images.unsplash.com/photo-1502741126161-b048400d6b6a",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
  "https://images.unsplash.com/photo-1580910051075-9d85b8f0d3b4",
  "https://images.unsplash.com/photo-1516684669134-de6f0b0f1e6f",
  "https://images.unsplash.com/photo-1514512364185-3b3d3a8a0f4f",
  "https://images.unsplash.com/photo-1542195102-36f8a7f9c6d6",
];

export default function WelcomeScreen({ navigation }) {
  // Bagi gambar jadi 3 kolom seperti grid Pinterest
  const columns = [[], [], []];
  sampleImages.forEach((img, i) => {
    columns[i % 3].push(img);
  });

  return (
    <LinearGradient colors={["#FFFFFF", "#F3F7FB"]} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Grid gambar */}
        <View style={styles.gridRow}>
          {columns.map((col, colIndex) => (
            <View key={colIndex} style={styles.column}>
              {col.map((uri, idx) => (
                <Image
                  key={idx}
                  source={{ uri }}
                  style={[
                    styles.image,
                    { height: COL_WIDTH * (1 + ((idx + colIndex) % 3) * 0.25) },
                  ]}
                  resizeMode="cover"
                />
              ))}
            </View>
          ))}
        </View>

        {/* Teks dan tombol */}
        <View style={styles.textBlock}>
          <Text style={styles.title}>Pantau dan Catat Harga Komoditas Pasar</Text>
          <Text style={styles.subtitle}>
            Membantu petugas pasar mencatat harga dengan cepat dan akurat setiap
            hari.
          </Text>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.replace("Login")}
            style={styles.buttonWrapper}
          >
            <LinearGradient
              colors={["#174A6A", "#0B3B53"]}
              style={styles.button}
              start={[0, 0]}
              end={[1, 1]}
            >
              <Text style={styles.buttonText}>Mulai Sekarang</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: GAP,
    alignItems: "center",
  },
  gridRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginTop: 12,
  },
  column: {
    width: COL_WIDTH,
  },
  image: {
    width: "100%",
    borderRadius: 8,
    marginBottom: GAP,
  },
  textBlock: {
    marginTop: 16,
    alignItems: "center",
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 18,
    lineHeight: 18,
  },
  buttonWrapper: {
    width: "85%",
  },
  button: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
