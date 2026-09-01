import { apiClient, setAuthToken, clearAuthToken } from "./client";

export const login = async (username, password) => {
  const { data } = await apiClient.post("/auth/login", { username, password });
  setAuthToken(data.token);
  return data;
};

export const logout = () => clearAuthToken();

export const fetchSiteContent = async () => {
  const { data } = await apiClient.get("/site-content");
  return data;
};

export const updateSiteContent = async (content) => {
  const { data } = await apiClient.put("/site-content", content);
  return data;
};

export const resetSiteContent = async () => {
  const { data } = await apiClient.post("/site-content/reset");
  return data;
};

export const fetchAppointments = async () => {
  const { data } = await apiClient.get("/appointments");
  return data;
};

export const createAppointment = async (appointment) => {
  const { data } = await apiClient.post("/appointments", appointment);
  return data;
};

export const updateAppointmentStatus = async (id, status) => {
  const { data } = await apiClient.patch(`/appointments/${id}`, { status });
  return data;
};

export const deleteAppointment = async (id) => {
  await apiClient.delete(`/appointments/${id}`);
};

export const fetchMessages = async () => {
  const { data } = await apiClient.get("/messages");
  return data;
};

export const createMessage = async (message) => {
  const { data } = await apiClient.post("/messages", message);
  return data;
};

export const updateMessageStatus = async (id, status) => {
  const { data } = await apiClient.patch(`/messages/${id}`, { status });
  return data;
};

export const deleteMessage = async (id) => {
  await apiClient.delete(`/messages/${id}`);
};
