import httpClient from "../../shared/api/httpClient";

export const uploadDocument = async (formData) => {
  const response = await httpClient.post("/api/upload/single", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteDocument = async (payload) => {
  const response = await httpClient.post("/api/vehicle/doc-delete", payload);
  return response.data;
};
