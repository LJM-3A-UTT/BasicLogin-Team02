// src/screens/Home.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';


export default function Home() {

    const router = useRouter();
  


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido</Text>
      <Text style={styles.email}>usuario@ejemplo.com</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>  router.push('/sign-in')}
      >
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: '700' },
  email: { marginTop: 8, fontSize: 16, color: '#666' },
  button: { marginTop: 20, backgroundColor: '#e53e3e', padding: 12, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: '600' },
});
