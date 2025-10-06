// src/components/AppointmentModal.tsx
import React from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type AppointmentModalProps = {
  visible: boolean;
  formData: {
    paciente: string;
    doctor: string;
    fecha: string;
    hora: string;
    motivo: string;
  };
  setFormData: (data: any) => void;
  onClose: () => void;
  onSave: () => void;
  isEditing: boolean;
};

export default function AppointmentModal({
  visible,
  formData,
  setFormData,
  onClose,
  onSave,
  isEditing,
}: AppointmentModalProps) {
  const content = (
    <View style={styles.modalOverlay}>
      <View
        style={[
          styles.modalCard,
          Platform.OS === "web" && styles.modalCardWeb,
        ]}
      >
        <Text style={styles.title}>
          {isEditing ? "Editar Cita" : "Nueva Cita"}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre del paciente"
          value={formData.paciente}
          onChangeText={(t) => setFormData({ ...formData, paciente: t })}
        />
        <TextInput
          style={styles.input}
          placeholder="Nombre del doctor"
          value={formData.doctor}
          onChangeText={(t) => setFormData({ ...formData, doctor: t })}
        />
        <TextInput
          style={styles.input}
          placeholder="Fecha (dd/mm/aaaa)"
          value={formData.fecha}
          onChangeText={(t) => setFormData({ ...formData, fecha: t })}
        />
        <TextInput
          style={styles.input}
          placeholder="Hora (hh:mm)"
          value={formData.hora}
          onChangeText={(t) => setFormData({ ...formData, hora: t })}
        />
        <TextInput
          style={styles.inputMultiline}
          placeholder="Motivo"
          value={formData.motivo}
          multiline
          onChangeText={(t) => setFormData({ ...formData, motivo: t })}
        />

        <TouchableOpacity style={styles.saveButton} onPress={onSave}>
          <Text style={styles.saveText}>
            {isEditing ? "Guardar cambios" : "Crear cita"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // En móvil usamos Modal nativo
  if (Platform.OS !== "web") {
    return (
      <Modal transparent visible={visible} animationType="fade">
        {content}
      </Modal>
    );
  }

  // En web usamos un View condicional
  return visible ? content : null;
}

const styles = StyleSheet.create({
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
    zIndex: 1000,
    elevation: 10,
  },
  modalCard: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    zIndex: 1001,
    elevation: 11,
  },
  modalCardWeb: {
    width: "60%",
    maxWidth: 600,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
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
  saveButton: {
    backgroundColor: "#1DA1F2",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontWeight: "600",
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "#e53e3e",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  closeText: {
    color: "#fff",
    fontWeight: "600",
  },
});
