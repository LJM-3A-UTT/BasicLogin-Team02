// src/services/getApod.ts
import nasaApi from "../api/nasaApi";

export async function getApod() {
  const res = await nasaApi.get("/planetary/apod");
  return res.data;
}
