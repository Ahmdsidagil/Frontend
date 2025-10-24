import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNotification } from "../context/NotificationContext"; // import context

export default function NotificationScreen({ navigation }) {
  const { notifEnabled, notifications } = useNotification();

  // Komponen untuk menampilkan item notifikasi
  const renderNotification = ({ item }) => (
    <View style={styles.notificationItem}>
      <Ionicons name="notifications" size={24} color="#174A6A" />
      <View style={{ marginLeft: 10, flex: 1 }}>
        <Text style={styles.notifTitle}>{item.title}</Text>
        <Text style={styles.notifDesc}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifikasi</Text>
        {/* Spacer agar judul tetap center */}
        <View style={{ width: 24 }} />
      </View>

      {/* ===== KONTEN NOTIFIKASI ===== */}
      {!notifEnabled ? (
        // 🔕 Saat notifikasi dimatikan
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-off" size={80} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>Notifikasi Dimatikan</Text>
          <Text style={styles.emptySubtitle}>
            Hidupkan notifikasi di menu profil untuk menerima pemberitahuan.
          </Text>
        </View>
      ) : notifications.length === 0 ? (
        // 📭 Saat tidak ada notifikasi baru
        <View style={styles.emptyContainer}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/4076/4076503.png",
            }}
            style={styles.emptyImage}
          />
          <Text style={styles.emptyTitle}>Belum ada pemberitahuan</Text>
          <Text style={styles.emptySubtitle}>
            Kembali ke sini untuk mendapatkan informasi terbaru tentang status
            data Anda.
          </Text>
        </View>
      ) : (
        // 🔔 Tampilkan daftar notifikasi
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderNotification}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    backgroundColor: "#0c3b57",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  backButton: {
    padding: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  emptyImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
    opacity: 0.8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    textTransform: "capitalize",
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: "center",
    color: "#6B7280",
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  notifDesc: {
    fontSize: 12,
    color: "#6B7280",
  },
});
