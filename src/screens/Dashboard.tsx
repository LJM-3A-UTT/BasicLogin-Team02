// src/screens/Dashboard.tsx
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect } from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");

export default function Dashboard() {

// Verificar JWT al cargar la pantalla
useEffect(() => {
  const redirectIfNoToken = async () => {
    let token: string | null = null;
    if (Platform.OS === 'web') {
      token = localStorage.getItem('jwt');
      console.log(token)
    } else {
      token = await SecureStore.getItemAsync('jwt');
    }

    if (!token) {
      setTimeout(() => router.replace('/sign-in'), 0); // Espera a que la pantalla se monte
    }
  };

  redirectIfNoToken();
}, []);

    const handleLogout = async () => {
    try {
      if (Platform.OS === "web") {
        localStorage.removeItem("jwt");
      } else {
        await SecureStore.deleteItemAsync("jwt");
      }
      router.replace("/sign-in");
    } catch (error) {
      console.log("Error al cerrar sesión", error);
    }
  };

  const router = useRouter();

  const handleNasaInfo = () => {
    router.push("./infonasa");
  };

  const handleAppointments = () => {
    router.push("./appointment");
  };

  const handleMedics = () => {
    router.push("./medics");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard Principal</Text>
          <Text style={styles.subtitle}>Selecciona una opción para continuar</Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.nasaButton]} 
            onPress={handleNasaInfo}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonIcon}>🚀</Text>
              <Text style={styles.buttonTitle}>Astronomia del dia</Text>
              <Text style={styles.buttonDescription}>
                Descubre la astronomía del día con datos de la API de la NASA
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.appointmentsButton]} 
            onPress={handleAppointments}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonIcon}>📅</Text>
              <Text style={styles.buttonTitle}>Gestión de Citas</Text>
              <Text style={styles.buttonDescription}>
                Administra y programa tus citas médicas desde AsyncStorage
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.doctorsButton]} 
            onPress={handleMedics}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonIcon}>👨‍⚕️</Text>
              <Text style={styles.buttonTitle}>Gestión de Medicos</Text>
              <Text style={styles.buttonDescription}>
                Administra tus medicos
              </Text>
            </View>
          </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>

        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Aplicación de gestión médica con información astronómica
          </Text>
        </View>


      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#7f8c8d",
    textAlign: "center",
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    ...Platform.select({
      web: {
        flexDirection: screenWidth > 768 ? "row" : "column",
        maxWidth: 800,
        alignSelf: "center",
        width: "100%",
      },
    }),
  },
  button: {
    borderRadius: 16,
    padding: 24,
    minHeight: 180,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    ...Platform.select({
      web: {
        width: screenWidth > 768 ? "45%" : "100%",
        maxWidth: 350,
      },
      default: {
        width: "100%",
        maxWidth: 350,
      },
    }),
  },
  nasaButton: {
    backgroundColor: "#13114D",
  },
  appointmentsButton: {
    backgroundColor: "#2ecc71",
  },
  doctorsButton: {
    backgroundColor:"#7CABEB"
  },
  buttonContent: {
    alignItems: "center",
  },
  buttonIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  buttonTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  buttonDescription: {
    fontSize: 14,
    color: "#ecf0f1",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  footer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: "#95a5a6",
    textAlign: "center",
  },
    logoutButton: {
    backgroundColor: "#e53e3e",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
    logoutText: {
    color: "#fff",
    fontWeight: "600",
  },
});