import axios from "axios";

/**
 * Challan Webhook Admin Service
 */

const BASE_URL = (import.meta.env.VITE_BASE_URL || "http://localhost:3000") + "/api";

/** GET /api/challan-webhook/all */
export const getAllWebhooks = async () => {
  const res = await axios.get(`${BASE_URL}/challan-webhook/all`);
  return res.data; // { success, count, data: [...] }
};

/** DELETE /api/challan-webhook/:id */
export const deleteSingleWebhook = async (id) => {
  const res = await axios.delete(`${BASE_URL}/challan-webhook/${id}`);
  return res.data;
};

/** POST /api/challan-webhook/bulk-delete */
export const bulkDeleteWebhooks = async (ids) => {
  const res = await axios.post(`${BASE_URL}/challan-webhook/bulk-delete`, { ids });
  return res.data;
};

const challanWebhookService = {
  getAllWebhooks,
  deleteSingleWebhook,
  bulkDeleteWebhooks,
};

export default challanWebhookService;
