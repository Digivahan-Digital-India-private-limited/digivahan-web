import axios from "axios";

/**
 * Challan Webhook Admin Service
 */

const BASE_URL = (import.meta.env.VITE_BASE_URL || "https://api.digivahan.in") + "/api";

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

/** POST /api/challan-webhook/receipt-url
 *  Pass the PDF key (filename) and get back a pre-signed URL to open the PDF.
 */
export const getReceiptUrl = async (key) => {
  const res = await axios.post(`${BASE_URL}/challan-webhook/receipt-url`, { key });
  return res.data; // { success, url, data }
};

const challanWebhookService = {
  getAllWebhooks,
  deleteSingleWebhook,
  bulkDeleteWebhooks,
};

export default challanWebhookService;
