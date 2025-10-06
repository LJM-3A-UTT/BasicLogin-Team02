// src/screens/InfoNasa.tsx
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getApod } from "../utils/getApod";

const { width: screenWidth } = Dimensions.get("window");

export default function InfoNasa() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nasaData, setNasaData] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

const fetchNasaData = async (): Promise<void> => {
  const controller = new AbortController();

  try {
    setLoading(true);
    setError(null);

    // const res = await nasaApi.get("/apod", {
    //   timeout: 8000,
    //   signal: controller.signal,
    // });

    const res = await getApod()

    if (!res.data || res.data.media_type !== "image") {
      throw new Error("Respuesta inválida o no es una imagen");
    }

    setNasaData({
      title: res.data.title,
      url: res.data.url,
      date: res.data.date,
      explanation: res.data.explanation,
      media_type: res.data.media_type,
    });
  } catch (err: unknown) {
    console.error("Error fetching NASA data:", err);

    if (axios.isAxiosError(err)) {
      if (err.code === "ECONNABORTED") {
        setError("Tiempo de espera agotado.");
      } else if (err.response?.status === 404) {
        setError("No se encontró el recurso de la NASA.");
      } else if (err.response?.status && err.response.status >= 500) {
        setError("Error del servidor de NASA.");
      } else {
        setError("Error al cargar la información de la NASA.");
      }
    } else if (err instanceof Error) {
      // Error genérico de JavaScript
      setError(err.message);
    } else {
      // Algo completamente inesperado
      setError("Error desconocido.");
    }
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};


  useEffect(() => {
    fetchNasaData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNasaData();
  };

  const handleDashboard = () => {
    router.push("/home");
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1DA1F2" />
        <Text style={styles.loadingText}>Cargando información de la NASA...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={fetchNasaData}>
          <Text style={styles.buttonText}>Intentar de nuevo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Astronomía del Día</Text>
        <Text style={styles.subtitle}>NASA - {nasaData?.date}</Text>
      </View>

      <View style={styles.imageContainer}>
        {nasaData?.media_type === "image" ? (
          <Image
            source={{ uri: nasaData.url }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.videoPlaceholder}>
            <Text style={styles.videoText}>
              Este contenido es un video. Visita la web de la NASA para verlo.
            </Text>
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.imageTitle}>{nasaData?.title}</Text>
        
        {nasaData?.copyright && (
          <Text style={styles.copyright}>© {nasaData.copyright}</Text>
        )}
        
        <Text style={styles.description}>{nasaData?.explanation}</Text>
      </View>

      <TouchableOpacity style={styles.continueButton} onPress={handleDashboard}>
        <Text style={styles.continueButtonText}>Volver al dashboard</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  errorText: {
    fontSize: 16,
    color: "#e53e3e",
    textAlign: "center",
    marginBottom: 20,
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  imageContainer: {
    width: "100%",
    height: Platform.OS === "web" ? 500 : 300,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
    backgroundColor: "#000",
    ...Platform.select({
      web: {
        width: screenWidth < 768 ? "100%" : "80%",
        alignSelf: "center",
      },
    }),
  },
  image: {
    width: "100%",
    height: "100%",
  },
  videoPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#222",
  },
  videoText: {
    color: "#fff",
    textAlign: "center",
    padding: 20,
    fontSize: 16,
  },
  infoContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    ...Platform.select({
      web: {
        width: screenWidth < 768 ? "100%" : "80%",
        alignSelf: "center",
      },
    }),
  },
  imageTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  copyright: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
    fontStyle: "italic",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  button: {
    backgroundColor: "#1DA1F2",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  continueButton: {
    backgroundColor: "#1DA1F2",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    ...Platform.select({
      web: {
        width: screenWidth < 768 ? "100%" : "50%",
        alignSelf: "center",
      },
    }),
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});