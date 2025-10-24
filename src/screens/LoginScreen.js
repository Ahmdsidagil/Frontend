import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [kode, setKode] = useState('');

  const handleLogin = () => {
    if (!email || !kode) {
      Alert.alert('Peringatan', 'Email dan kode harus diisi!');
      return;
    }

    // === LOGIN STATIS ===
    const staticEmail = 'admin@gmail.com';
    const staticKode = '1234';

    if (email === staticEmail && kode === staticKode) {
      Alert.alert('Sukses', 'Login berhasil!');
      navigation.replace('Dashboard');
    } else {
      Alert.alert('Gagal', 'Email atau kode salah!');
    }
  };

  return (
    <LinearGradient colors={['#FFFFFF', '#F3F7FB']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}
      >
        <View style={styles.logoContainer}>
          <Image
            source={{
              uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Coat_of_arms_of_Indonesia_Garuda_Pancasila.svg/512px-Coat_of_arms_of_Indonesia_Garuda_Pancasila.svg.png',
            }}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>MASUK</Text>
          <Text style={styles.subtitle}>Masukkan email dan kode Anda</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            placeholder="Alamat Email"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            placeholder="Kode"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            secureTextEntry
            value={kode}
            onChangeText={setKode}
          />

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleLogin}
            style={styles.buttonWrapper}
          >
            <LinearGradient
              colors={['#174A6A', '#0B3B53']}
              style={styles.button}
              start={[0, 0]}
              end={[1, 1]}
            >
              <Text style={styles.buttonText}>Masuk</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 14,
    color: '#111827',
  },
  buttonWrapper: {
    marginTop: 6,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});
