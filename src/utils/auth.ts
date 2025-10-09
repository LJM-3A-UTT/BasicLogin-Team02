import authApi from "../api/authApi";

export async function singIn(email: string, password: string) {
  try {
    const res = await authApi.post("/api/auth/login", { email, password });
    return res.data;
  } catch (err: any) {
    console.error("❌ Error en singIn:", err);
    return { msg: "Error de conexión" }; // siempre devuelve un objeto consistente
  }
}
