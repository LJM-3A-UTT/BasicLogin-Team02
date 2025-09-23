// src/screens/Home.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions, Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");

// Calcula ancho de tarjeta dinámicamente
function getCardWidth() {
  if (screenWidth < 500) return "100%"; // móviles pequeños: 1 por fila
  if (screenWidth < 800) return "48%";  // tablets o pantallas medianas: 2 por fila
  return "32%";                          // desktop: 3 por fila
}

export default function Home() {
  const router = useRouter();
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
  const [isEditing, setIsEditing] = useState(false); // nuevo estado para saber si estamos editando

  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [nasaModal, setNasaModal] = useState<any>(null);

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
  const urlsUsadas = citas.map(c => c.nasa?.url).filter(Boolean); // urls ya usadas

  try {
    let data;
    let intentos = 0;
    do {
      const res = await fetch(
        "https://api.nasa.gov/planetary/apod?api_key=zpBtiG3MebkwF5QhEC3eA5VcOZgLyaXk8LUU8Uti"
      );
      data = await res.json();
      intentos++;
      // Si la API devuelve video en lugar de imagen, ignorarlo y pedir otra
      if (data.media_type !== "image") data.url = null;
      if (intentos > 10) break; // evitar loop infinito si se acaban imágenes
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


  // Abrir detalle y traer datos de NASA para ese modal
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

return (
  <View style={styles.container}>
    {/* Barra superior */}
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.createText}>+ Crear cita</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => router.push("/sign-in")}
      >
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>

    <Text style={styles.title}>📅 Mis Citas</Text>

    {/* Lista de citas */}
    <ScrollView style={{ marginTop: 20 }}>
      <View style={styles.cardsContainer}>
        {citas.map((cita) => (
          <View key={cita.id} style={styles.card}>
            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
              {/* Imagen NASA */}
              {cita.nasa?.url && (
                <Image
                  source={{ uri: cita.nasa.url }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
              )}

              {/* Información de la cita */}
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

            {/* Modal detalle */}
            <Modal
              visible={detalleVisible === cita.id}
              animationType="slide"
              transparent
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalCardWeb}>
                  <Text style={styles.title}>Detalles de la cita</Text>

                  <View style={{ marginTop: 10 }}>
                    <Text>👤 Paciente: {cita.paciente}</Text>
                    <Text>👨‍⚕️ Doctor: {cita.doctor}</Text>
                    <Text>📆 Fecha: {cita.fecha}</Text>
                    <Text>⏰ Hora: {cita.hora}</Text>
                    <Text>📝 Motivo: {cita.motivo}</Text>
                  </View>

                  {/* Imagen y cita NASA lado a lado */}
                  {nasaModal && (
                    <View
                      style={{
                        flexDirection: "row",
                        marginTop: 12,
                        alignItems: "flex-start",
                      }}
                    >
                      <Image
                        source={{ uri: nasaModal.url }}
                        style={{
                          width: 150,
                          height: 150,
                          borderRadius: 12,
                          marginRight: 10,
                        }}
                        resizeMode="cover"
                      />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.nasaTitle}>🚀 {nasaModal.title}</Text>
                        <Text style={styles.nasaText}>
                          {nasaModal.date} - Fuente: {nasaModal.author}
                        </Text>
                        <ScrollView style={{ maxHeight: 120, marginTop: 6 }}>
                          <Text style={styles.nasaText}>
                            {nasaModal.curiosidad}
                          </Text>
                        </ScrollView>
                      </View>
                    </View>
                  )}

                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setDetalleVisible(null)}
                  >
                    <Text style={styles.logoutText}>Cerrar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        ))}
      </View>
    </ScrollView>

    {/* Modal crear cita */}
    <Modal visible={modalVisible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCardWeb}>
          <Text style={styles.title}>Nueva Cita</Text>
          <TextInput
            placeholder="Paciente"
            style={styles.input}
            value={formData.paciente}
            onChangeText={(t) => setFormData({ ...formData, paciente: t })}
          />
          <TextInput
            placeholder="Doctor"
            style={styles.input}
            value={formData.doctor}
            onChangeText={(t) => setFormData({ ...formData, doctor: t })}
          />

          {Platform.OS === "web" ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="📆 Seleccionar fecha"
                value={formData.fecha}
                onFocus={(e: any) => (e.target.type = "date")}
                onChangeText={(t) => setFormData({ ...formData, fecha: t })}
              />
              <TextInput
                style={styles.input}
                placeholder="⏰ Seleccionar hora"
                value={formData.hora}
                onFocus={(e: any) => (e.target.type = "time")}
                onChangeText={(t) => setFormData({ ...formData, hora: t })}
              />
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowDate(true)}
              >
                <Text>{formData.fecha || "📆 Seleccionar fecha"}</Text>
              </TouchableOpacity>
              {showDate && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={onChangeDate}
                />
              )}

              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowTime(true)}
              >
                <Text>{formData.hora || "⏰ Seleccionar hora"}</Text>
              </TouchableOpacity>
              {showTime && (
                <DateTimePicker
                  value={date}
                  mode="time"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={onChangeTime}
                />
              )}
            </>
          )}

          <TextInput
            placeholder="Motivo"
            style={styles.inputMultiline}
            multiline
            value={formData.motivo}
            onChangeText={(t) => setFormData({ ...formData, motivo: t })}
          />

          <TouchableOpacity style={styles.createButton} onPress={crearCita}>
            <Text style={styles.createText}>✔ Guardar cita</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.logoutText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  </View>
);

}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: { fontSize: 22, fontWeight: "700", textAlign: "center" },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center", // centramos las tarjetas
    marginHorizontal: -8, // compensamos el margen de cada tarjeta
  },
  card: {
    backgroundColor: "#f7f7f7",
    padding: 10,
    borderRadius: 12,
    margin: 8, // margen horizontal y vertical para simetría
    width: getCardWidth(), // ancho responsive
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  cardInfo: { flex: 1, justifyContent: "center" },
  cardTitle: { fontSize: 16, fontWeight: "700" },
  cardText: { fontSize: 14, marginTop: 4 },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  link: { color: "#1DA1F2", fontWeight: "600" },
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
  createText: { color: "#fff", fontWeight: "600" },
  logoutButton: {
    backgroundColor: "#e53e3e",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: { color: "#fff", fontWeight: "600" },
  nasaTitle: { fontWeight: "700", marginTop: 6 },
  nasaText: { fontSize: 12, marginTop: 4, color: "#444" },
});



