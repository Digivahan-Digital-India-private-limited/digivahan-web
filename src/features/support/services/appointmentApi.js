import httpClient from "../../shared/api/httpClient";

export const createAppointment = (formData) => {
  return httpClient.post("/api/appointment/create", formData);
};

export const getAppointments = (params) => {
  return httpClient.get("/api/appointment/list", { params });
};

export const updateAppointment = (id, payload) => {
  return httpClient.put(`/api/appointment/update/${id}`, payload);
};

export const deleteAppointments = (ids) => {
  return httpClient.delete("/api/appointment/delete", { data: { ids } });
};

export const getAppointmentByTicketId = (ticketId) => {
  return httpClient.get(`/api/appointment/ticket/${ticketId}`);
};
