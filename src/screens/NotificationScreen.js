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
import { useNotification } from "../context/NotificationContext";

/**
 * Layar notifikasi – selalu aktif
 */
export default function NotificationScreen({ navigation }) {
  const { notifications } = useNotification();

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
      {/* 🔹 Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifikasi</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* 🔹 Konten */}
      {notifications.length === 0 ? (
        // 📭 Tidak ada notifikasi
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
        // 🔔 Daftar notifikasi
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
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginTop:24,
  },
  backButton: {
    padding: 12,
    marginTop: 24,
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
