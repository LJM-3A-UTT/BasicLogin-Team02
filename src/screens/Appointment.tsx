// src/screens/Home.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

//Importar api de la Nasa
import nasaApi from "../api/nasaApi";

import AppointmentModal from "@/src/components/AppointmentModal";

const { width: screenWidth } = Dimensions.get("window");

function getCardWidth() {
  if (screenWidth < 500) return "100%";
  if (screenWidth < 800) return "48%";
  return "32%";
}

export default function Appointment() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [citas, setCitas] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [detalleVisible, setDetalleVisible] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    paciente: "",
    doctor: "",
    fecha: "",
    hora: "",
    motivo: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [nasaModal, setNasaModal] = useState<any>(null);

  // Verificar JWT al cargar la pantalla
  //   useEffect(() => {
  //   const redirectIfNoToken = async () => {
  //     let token: string | null = null;
  //     if (Platform.OS === 'web') {
  //       token = localStorage.getItem('jwt');
  //     } else {
  //       token = await SecureStore.getItemAsync('jwt');
  //     }

  //     if (token) {
  //       setTimeout(() => router.replace('/sign-in'), 0); // Espera a que la pantalla se monte
  //     }
  //   };

  //   redirectIfNoToken();
  // }, []);

  // Cargar citas desde AsyncStorage
  useEffect(() => {
    const loadCitas = async () => {
      try {
        const stored = await AsyncStorage.getItem("citas");
        if (stored) setCitas(JSON.parse(stored));
      } catch (error) {
        console.log("Error al cargar citas", error);
      }
    };
    loadCitas();
  }, []);

  // Guardar citas en AsyncStorage
  useEffect(() => {
    const saveCitas = async () => {
      try {
        await AsyncStorage.setItem("citas", JSON.stringify(citas));
      } catch (error) {
        console.log("Error al guardar citas", error);
      }
    };
    saveCitas();
  }, [citas]);

  const crearCita = async () => {
    if (!formData.paciente || !formData.doctor) return;

    let nasa = null;
    const urlsUsadas = citas.map((c) => c.nasa?.url).filter(Boolean);

    try {
      let data;
      let intentos = 0;
      do {
        const res = await nasaApi.get("/apod");
        data = await res.data;
        intentos++;
        if (data.media_type !== "image") data.url = null;
        if (intentos > 10) break;
      } while (!data.url || urlsUsadas.includes(data.url));

      nasa = {
        url: data.url,
        title: data.title,
        date: data.date,
        author: data.copyright || "NASA",
        curiosidad: `Dato curioso: ${data.explanation.substring(0, 200)}...`,
      };
    } catch (error) {
      console.log("Error al traer datos de NASA", error);
    }

    const citaConNasa = { ...formData, id: Date.now(), nasa };
    setCitas([...citas, citaConNasa]);
    setFormData({ paciente: "", doctor: "", fecha: "", hora: "", motivo: "" });
    setModalVisible(false);
  };

  const eliminarCita = (id: number) => {
    setCitas(citas.filter((c) => c.id !== id));
  };

  const editarCita = (id: number) => {
    const cita = citas.find((c) => c.id === id);
    if (cita) {
      setFormData(cita);
      setIsEditing(true);
      setModalVisible(true);
    }
  };

  const cancelarModal = () => {
    setModalVisible(false);
    setFormData({ paciente: "", doctor: "", fecha: "", hora: "", motivo: "" });
    setIsEditing(false);
  };

  const abrirDetalle = async (cita: any) => {
    setDetalleVisible(cita.id);

    if (!cita.nasa) {
      try {
        const res = await fetch(
          "https://api.nasa.gov/planetary/apod?api_key=zpBtiG3MebkwF5QhEC3eA5VcOZgLyaXk8LUU8Uti"
        );
        const data = await res.json();
        setNasaModal({
          url: data.url,
          title: data.title,
          date: data.date,
          author: data.copyright || "NASA",
          curiosidad: `Dato curioso: ${data.explanation.substring(0, 200)}...`,
        });
      } catch (error) {
        console.log("Error al cargar NASA para el modal", error);
        setNasaModal(null);
      }
    } else {
      setNasaModal(cita.nasa);
    }
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDate(false);
    if (selectedDate) {
      setDate(selectedDate);
      setFormData({
        ...formData,
        fecha: selectedDate.toLocaleDateString("es-ES"),
      });
    }
  };

  const onChangeTime = (event: any, selectedTime?: Date) => {
    setShowTime(false);
    if (selectedTime) {
      setDate(selectedTime);
      setFormData({
        ...formData,
        hora: selectedTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    }
  };

  const handleDashboard = () => {
    router.push("/home");
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  // --- Resto de tu UI (modales, citas, listas) ---
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.createText}>+ Crear cita</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dashboardButton}
          onPress={handleDashboard}
        >
          <Text style={styles.dashboardText}>Volver al dashboard</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>📅 Mis Citas</Text>

      <ScrollView style={{ marginTop: 20 }}>
        <View style={styles.cardsContainer}>
          {citas.map((cita) => (
            <View key={cita.id} style={styles.card}>
              <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>{cita.paciente}</Text>
                  <Text style={styles.cardText}>👨‍⚕️ {cita.doctor}</Text>
                  <Text style={styles.cardText}>
                    📆 {cita.fecha} ⏰ {cita.hora}
                  </Text>
                  <Text style={styles.cardText}>📝 {cita.motivo}</Text>
                </View>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity onPress={() => abrirDetalle(cita)}>
                  <Text style={styles.link}>👁 Ver</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => editarCita(cita.id)}>
                  <Text style={styles.link}>✏ Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => eliminarCita(cita.id)}>
                  <Text style={styles.link}>🗑 Eliminar</Text>
                </TouchableOpacity>
              </View>

              {/* --- Modales detalles y creación siguen igual --- */}
              {/* ...copiar todo tu modal detalle y modal creación aquí sin cambios */}
            </View>
          ))}
        </View>
      </ScrollView>
      {modalVisible && (
        <AppointmentModal
          visible={modalVisible}
          formData={formData}
          setFormData={setFormData}
          onClose={cancelarModal}
          onSave={
            isEditing
              ? () => {
                  // editar lógica

                  cancelarModal();
                }
              : crearCita
          }
          isEditing={isEditing}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginHorizontal: -8,
  },
  card: {
    backgroundColor: "#f7f7f7",
    padding: 10,
    borderRadius: 12,
    margin: 8,
    width: getCardWidth(),
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  cardInfo: {
    flex: 1,
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  cardText: {
    fontSize: 14,
    marginTop: 4,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  link: {
    color: "#1DA1F2",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalCardWeb: {
    width: "70%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    maxHeight: "85%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  inputMultiline: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    minHeight: 70,
    textAlignVertical: "top",
  },
  closeButton: {
    marginTop: 12,
    backgroundColor: "#e53e3e",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  createButton: {
    backgroundColor: "#1DA1F2",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createText: {
    color: "#fff",
    fontWeight: "600",
  },
  dashboardText: {
    color: "#fff",
    fontWeight: "600",
  },
  dashboardButton: {
    backgroundColor: "#2ecc71",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  nasaTitle: {
    fontWeight: "700",
    marginTop: 6,
  },
  nasaText: {
    fontSize: 12,
    marginTop: 4,
    color: "#444",
  },
});
