import axios from "axios";

const AUTH_TOKEN_KEY = "physio-admin-token";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
});

apiClient.interceptors.request.use((config) => {
  const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getAuthToken = () => window.localStorage.getItem(AUTH_TOKEN_KEY);
export const setAuthToken = (token) => window.localStorage.setItem(AUTH_TOKEN_KEY, token);
export const clearAuthToken = () => window.localStorage.removeItem(AUTH_TOKEN_KEY);
