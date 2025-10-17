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

const { width: screenWidth } = Dimensions.get("window");

export default function InfoNasa() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nasaData, setNasaData] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNasaData = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      console.log("🔄 Iniciando carga de datos NASA...");

      // Usar una API key diferente y endpoint más confiable
      const apiKey = "DEMO_KEY"; // Clave demo de NASA que funciona
      const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;
      
      console.log("🌌 URL de NASA:", url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log("✅ Datos NASA recibidos:", data);

      if (!data) {
        throw new Error("No se recibieron datos de la NASA");
      }

      // Aceptar tanto imágenes como videos
      setNasaData({
        title: data.title || "Sin título",
        url: data.url || data.thumbnail_url,
        date: data.date || new Date().toISOString().split('T')[0],
        explanation: data.explanation || "Descripción no disponible",
        media_type: data.media_type || "image",
        copyright: data.copyright || "NASA",
      });

    } catch (err: any) {
      console.error("❌ Error fetching NASA data:", err);
      
      // Datos de ejemplo si la API falla
      setNasaData({
        title: "Vista del Universo",
        url: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        date: new Date().toISOString().split('T')[0],
        explanation: "El universo es todo lo que podemos tocar, sentir, percibir, medir o detectar. Abarca los cosas vivas, los planetas, las estrellas, las galaxias, las nubes de polvo, la luz e incluso el tiempo. El universo contiene miles de millones de galaxias, cada una con millones o billones de estrellas.",
        media_type: "image",
        copyright: "NASA"
      });
      
      setError("No se pudo cargar la información en tiempo real. Mostrando información de ejemplo.");
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
        <Text style={styles.loadingText}>Cargando astronomía del día...</Text>
        <Text style={styles.loadingSubtext}>Conectando con servidores NASA...</Text>
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
        <Text style={styles.title}>🌌 Astronomía del Día</Text>
        <Text style={styles.subtitle}>NASA - {nasaData?.date}</Text>
      </View>

      {error && (
        <View style={styles.warningBanner}>
          <Text style={styles.warningText}>⚠️ {error}</Text>
        </View>
      )}

      <View style={styles.imageContainer}>
        {nasaData?.media_type === "image" ? (
          <Image
            source={{ uri: nasaData.url }}
            style={styles.image}
            resizeMode="contain"
            onError={(e) => {
              console.error("❌ Error cargando imagen:", e.nativeEvent.error);
              setError("Error al cargar la imagen");
            }}
          />
        ) : (
          <View style={styles.videoContainer}>
            <Text style={styles.videoTitle}>🎥 Video del Día</Text>
            <Text style={styles.videoText}>{nasaData?.title}</Text>
            <TouchableOpacity 
              style={styles.videoButton}
              onPress={() => {
                if (Platform.OS === 'web') {
                  window.open(nasaData.url, '_blank');
                }
              }}
            >
              <Text style={styles.videoButtonText}>Ver Video en NASA.gov</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.imageTitle}>{nasaData?.title}</Text>
        
        {nasaData?.copyright && (
          <Text style={styles.copyright}>©️ {nasaData.copyright}</Text>
        )}
        
        <Text style={styles.description}>{nasaData?.explanation}</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.continueButton} onPress={handleDashboard}>
          <Text style={styles.continueButtonText}>📊 Volver al dashboard</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Text style={styles.refreshButtonText}>🔄 Actualizar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 18,
    color: "#2c3e50",
    fontWeight: "600",
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: "#7f8c8d",
    textAlign: "center",
  },
  header: {
    marginBottom: 25,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#7f8c8d",
    textAlign: "center",
  },
  warningBanner: {
    backgroundColor: "#fff3cd",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#ffc107",
  },
  warningText: {
    color: "#856404",
    fontSize: 14,
    textAlign: "center",
  },
  imageContainer: {
    width: "100%",
    height: Platform.OS === "web" ? 500 : 350,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 25,
    backgroundColor: "#1a1a2e",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
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
  videoContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    padding: 25,
  },
  videoTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  videoText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 22,
  },
  videoButton: {
    backgroundColor: "#1DA1F2",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    marginTop: 15,
    shadowColor: "#1DA1F2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  videoButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  infoContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    ...Platform.select({
      web: {
        width: screenWidth < 768 ? "100%" : "80%",
        alignSelf: "center",
      },
    }),
  },
  imageTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: 12,
    textAlign: "center",
  },
  copyright: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 18,
    fontStyle: "italic",
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    lineHeight: 26,
    color: "#34495e",
    textAlign: "justify",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    ...Platform.select({
      web: {
        width: screenWidth < 768 ? "100%" : "80%",
        alignSelf: "center",
      },
    }),
  },
  continueButton: {
    backgroundColor: "#1DA1F2",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    flex: 1,
    marginRight: 10,
    shadowColor: "#1DA1F2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  refreshButton: {
    backgroundColor: "#2ecc71",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    flex: 1,
    marginLeft: 10,
    shadowColor: "#2ecc71",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  refreshButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
