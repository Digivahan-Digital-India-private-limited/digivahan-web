import httpClient from "../../shared/api/httpClient";

/**
 * REPORT ISSUE SERVICE
 * Handles integration with /api/report-issue endpoints
 */

export const createReportIssue = async (formData) => {
  const response = await httpClient.post("/api/report-issue/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const listReportIssues = async (params = {}) => {
  const response = await httpClient.get("/api/report-issue/list", { params });
  return response.data;
};

export const updateReportIssue = async (id, payload) => {
  const response = await httpClient.put(`/api/report-issue/update/${id}`, payload);
  return response.data;
};

export const deleteReportIssues = async (payload) => {
  const response = await httpClient.delete("/api/report-issue/delete", { data: payload });
  return response.data;
};

export const getIssueByTicketId = async (ticketId) => {
  const response = await httpClient.get(`/api/report-issue/ticket/${ticketId}`);
  return response.data;
};
