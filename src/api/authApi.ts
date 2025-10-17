import axios, { AxiosHeaders, InternalAxiosRequestConfig } from "axios";
import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const BASE_URL = "http://localhost:4000";

const authApi = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

authApi.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;

    if (token) {
      config.headers = AxiosHeaders.from(config.headers);
      config.headers.set("Authorization", `Bearer ${token}`);
      config.headers.set("Content-Type", "application/json");
    }

    return config;
  }
);

export default authApi;
