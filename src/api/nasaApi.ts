import axios from "axios";

const nasaApi = axios.create({
    baseURL: "https://api.nasa.gov/planetary",
    timeout: 30000, // 30 segundos timeout
    params: {
        api_key: "aVKpthnByWtkGGWVJhsQuuzUXRWNb7ylYsqTzyx9"
    }
})

// Interceptor para manejar errores globalmente
nasaApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Tiempo de espera agotado. La NASA está respondiendo lentamente.');
    }
    if (error.response?.status >= 500) {
      throw new Error('Servidor de NASA no disponible temporalmente. Intenta más tarde.');
    }
    throw error;
  }
);

export default nasaApi;
