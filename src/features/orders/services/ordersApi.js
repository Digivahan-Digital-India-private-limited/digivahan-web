import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import httpClient from "../../shared/api/httpClient";
import {
  unwrapObject,
} from "../../shared/api/requestWithFallback";

const formatDate = (dateVal) => {
  if (!dateVal) return "N/A";
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return String(dateVal);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return String(dateVal);
  }
};

const normalizeOrder = (item) => {
  const orderItems = Array.isArray(item?.order_items) ? item.order_items : [];
  const firstItem = orderItems[0]?.name || item?.item || item?.product_name || item?.title || "DigiVahan Smart QR";

  return {
    id: String(item?._id || item?.id || item?.order_id || ""),
    item: firstItem,
    status: item?.order_status || item?.status || "PENDING",
    date: formatDate(item?.order_date || item?.createdAt || item?.date),
    amount: Number(item?.order_value || item?.sub_total || item?.amount || item?.price || 0),
    vehicle_id: orderItems[0]?.vehicle_id || item?.vehicle_id || "",
  };
};

export const listOrders = async () => {
  const token = Cookies.get("user_token");
  let userId = "";
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.userId || decoded.user_id;
    } catch (e) {
      console.error("Token decode error", e);
    }
  }

  if (!userId) {
    return [];
  }

  try {
    const response = await httpClient.post(`/api/orders-user-list`, { user_id: userId });
    const body = response?.data ?? response;
    const remoteOrdersRaw = Array.isArray(body?.orders) ? body.orders : [];
    return remoteOrdersRaw.map(normalizeOrder);
  } catch (error) {
    console.error("Error listing orders from backend:", error);
    return [];
  }
};

export const createOrder = async (orderData) => {
  const token = Cookies.get("user_token");
  let userId = "";
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.userId || decoded.user_id;
    } catch (e) {
      console.error("Token decode error", e);
    }
  }

  if (!userId) {
    throw new Error("No user ID found in session");
  }

  const payload = {
    user_id: userId,
    order_id: orderData.order_id || `DV-${Date.now()}`,
    active_partner: orderData.active_partner || "manual",
    payment_method: orderData.payment_method || "Prepaid",
    shipping_mode: orderData.shipping_mode || "Surface",
    sub_total: Number(orderData.amount || orderData.sub_total || 0),
    order_value: Number(orderData.amount || orderData.order_value || 0),
    declared_value: Number(orderData.amount || orderData.declared_value || 0),
    shipping_is_billing: orderData.shipping_is_billing !== false,
    shipping: {
      first_name: orderData.shipping?.first_name || "",
      last_name: orderData.shipping?.last_name || "",
      phone: orderData.shipping?.phone || "",
      email: orderData.shipping?.email || "",
      address1: orderData.shipping?.address1 || "",
      address2: orderData.shipping?.address2 || "",
      city: orderData.shipping?.city || "",
      state: orderData.shipping?.state || "",
      country: orderData.shipping?.country || "India",
      pincode: orderData.shipping?.pincode || "",
    },
    billing: {
      first_name: orderData.billing?.first_name || orderData.shipping?.first_name || "",
      last_name: orderData.billing?.last_name || orderData.shipping?.last_name || "",
      phone: orderData.billing?.phone || orderData.shipping?.phone || "",
      address1: orderData.billing?.address1 || orderData.shipping?.address1 || "",
      address2: orderData.billing?.address2 || orderData.shipping?.address2 || "",
      city: orderData.billing?.city || orderData.shipping?.city || "",
      state: orderData.billing?.state || orderData.shipping?.state || "",
      country: orderData.billing?.country || orderData.shipping?.country || "India",
      pincode: orderData.billing?.pincode || orderData.shipping?.pincode || "",
    },
    parcel: {
      length: 20,
      breadth: 15,
      height: 10,
      weight: 0.05,
    },
    order_items: [
      {
        vehicle_id: orderData.vehicle_id || "N/A",
        order_type: orderData.payment_method || "Prepaid",
        name: orderData.item || "DigiVahan Smart QR",
        sku: "QR-001",
        units: 1,
        selling_price: Number(orderData.amount || 0),
        selling_price_currency: "INR",
        weight: 0.05,
      },
    ],
  };

  // Include Razorpay payment details if provided
  if (orderData.razorpay_payment_id) {
    payload.razorpay_payment_id = orderData.razorpay_payment_id;
  }
  if (orderData.razorpay_order_id) {
    payload.razorpay_order_id = orderData.razorpay_order_id;
  }

  const response = await httpClient.post("/api/user/create-order", payload);
  const data = unwrapObject(response);
  return normalizeOrder(data?.data || data);
};

export const cancelOrder = async (orderId) => {
  const token = Cookies.get("user_token");
  let userId = "";
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.userId || decoded.user_id;
    } catch (e) {
      console.error("Token decode error", e);
    }
  }

  if (!userId) throw new Error("No user ID found in session");

  const response = await httpClient.post("/api/order/user-cancel", {
    order_id: orderId,
    user_id: userId,
  });
  return response?.data;
};
