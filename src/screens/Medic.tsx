import React, { useEffect, useState } from "react";
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
} from "react-native";
import authApi from "../api/authApi";

interface Medic {
  id?: number;
  nombre: string;
}

export default function MedicsScreen() {
  const [nombre, setNombre] = useState("");
  const [medics, setMedics] = useState<Medic[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMedics();
  }, []);

  const fetchMedics = async () => {
    try {
      setLoading(true);

      // Obtener el token desde localStorage
      const token = localStorage.getItem("jwt"); // Cambiar a localStorage.getItem
      console.log("Token recuperado:", token);

      // Enviar el token con la cabecera Authorization
      const res = await authApi.get("/api/medic/get", {
        headers: {
          Authorization: `Bearer ${token}`, // Enviar el token en la cabecera
        },
      });

      setMedics(res.data || []);
    } catch (err: any) {
      const msg =
        err?.response?.data?.msg || "No se pudieron obtener los médicos";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!nombre.trim()) {
      Alert.alert("Error", "Completa el nombre");
      return;
    }

    try {
      const res = await authApi.post("/api/medic/post", { nombre });

      Alert.alert("Éxito", "Médico creado correctamente");
      setNombre("");
      fetchMedics();
    } catch (err: any) {
      const status = err?.response?.status;
      const msg =
        err?.response?.data?.msg || "Error de conexión con el servidor";

      if (status === 403 && /MFA/i.test(msg)) {
        Alert.alert(
          "Seguridad",
          "Necesitas activar o completar MFA (AAL2) para realizar esta acción."
        );
      } else if (status === 401) {
        Alert.alert(
          "Sesión",
          "Tu sesión no es válida o expiró. Inicia sesión de nuevo."
        );
      } else {
        Alert.alert("Error", msg);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
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
            keyExtractor={(item, idx) =>
              item.id ? String(item.id) : `tmp-${idx}`
            }
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={styles.itemText}>{item.nombre}</Text>
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.empty}>No hay médicos registrados</Text>
            }
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 480,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#1DA1F2",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  item: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  itemText: {
    fontSize: 16,
    fontWeight: "600",
  },
  itemSub: {
    color: "#555",
  },
  loading: {
    textAlign: "center",
    marginTop: 10,
  },
  empty: {
    textAlign: "center",
    color: "#777",
    marginTop: 10,
  },
});
