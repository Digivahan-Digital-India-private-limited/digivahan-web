import axios from "axios";
import Cookies from "js-cookie";

export const BASE_URL =
  import.meta.env.VITE_BASE_URL || "https://api.digivahan.in";

export const httpClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

httpClient.interceptors.request.use((config) => {
  const userToken = Cookies.get("user_token");
  if (userToken) {
    config.headers.Authorization = `Bearer ${userToken}`;
  }

  return config;
});

export default httpClient;
