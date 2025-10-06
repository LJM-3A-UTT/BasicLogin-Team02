import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import authApi from '../api/authApi';

const API_URL = 'http://192.168.0.10:4000/api/medics'; // 👈 cámbiala por tu IP

interface Medic {
  id?: number;
  nombre: string;
  especialidad: string;
}

export default function MedicsScreen() {
  const [nombre, setNombre] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [medics, setMedics] = useState<Medic[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMedics();
  }, []);

  const fetchMedics = async () => {
    try {
      setLoading(true);
      const res = await authApi.get("/api/medic/get");
      const data = await res.data;
      setMedics(data);
    } catch (err) {
      Alert.alert('Error', 'No se pudieron obtener los médicos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!nombre.trim()) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }

    try {
      const res = await authApi.post("/api/medic/post", {
        nombre,
      });

      if (!res) {
        Alert.alert('Error','No se pudo crear el médico');
        return;
      }

      Alert.alert('Éxito', 'Médico creado correctamente');
      setNombre('');
      setEspecialidad('');
      fetchMedics(); // refrescar lista
    } catch (err) {
      Alert.alert('Error', 'Error de conexión con el servidor');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Gestión de Médicos</Text>

        {/* FORMULARIO */}
        <TextInput
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
          style={styles.input}
        />
        <TouchableOpacity style={styles.button} onPress={handleCreate}>
          <Text style={styles.buttonText}>Registrar Médico</Text>
        </TouchableOpacity>

        {/* LISTADO */}
        <Text style={styles.subtitle}>Lista de Médicos</Text>
        {loading ? (
          <Text style={styles.loading}>Cargando...</Text>
        ) : (
          <FlatList
            data={medics}
            keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={styles.itemText}>{item.nombre}</Text>
                <Text style={styles.itemSub}>{item.especialidad}</Text>
              </View>
            )}
            ListEmptyComponent={<Text style={styles.empty}>No hay médicos registrados</Text>}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#1DA1F2',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  item: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '600',
  },
  itemSub: {
    color: '#555',
  },
  loading: {
    textAlign: 'center',
    marginTop: 10,
  },
  empty: {
    textAlign: 'center',
    color: '#777',
    marginTop: 10,
  },
});
