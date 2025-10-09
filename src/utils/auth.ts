import authApi from "../api/authApi";

export async function singIn(email: string, password: string) {
  try {
    const res = await authApi.post("/api/auth/login", { email, password });
    return res.data; // Login exitoso
  } catch (err: any) {
    // Axios coloca la respuesta del servidor en err.response
    if (err.response && err.response.data) {
      return err.response.data; // Devuelve el mensaje real del backend
    }
    return { msg: "Error de conexión" }; // Solo si no hay respuesta del servidor
  }
}
