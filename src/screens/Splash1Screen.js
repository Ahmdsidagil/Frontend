import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Splash1Screen({ navigation }) {
  useEffect(() => {
    // Setelah 2.5 detik, pindah ke layar login
    const timer = setTimeout(() => {
      if (navigation) navigation.replace('Login');
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* Ganti logo.png dengan icon bawaan supaya tidak error */}
        <Ionicons name="leaf-outline" size={70} color="#0B3B53" />
        <Text style={styles.text}>Hakom App</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0B3B53',
    marginLeft: 14,
  },
});
