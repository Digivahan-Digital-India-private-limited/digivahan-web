import httpClient from "../../shared/api/httpClient";
import {
  requestWithFallback,
  unwrapCollection,
} from "../../shared/api/requestWithFallback";
import { mockOrders } from "../../shared/mock/userSystemMockData";

const ORDERS_STORAGE_KEY = "dv_user_orders_mock";

const normalizeOrder = (item) => ({
  id: String(item?.id || item?._id || item?.order_id || item?.orderId || ""),
  item: item?.item || item?.product_name || item?.title || "Order Item",
  status: item?.status || item?.order_status || "In Transit",
  date: item?.date || item?.created_at || item?.createdAt || "N/A",
  amount: Number(item?.amount || item?.price || item?.total_amount || 0),
});

const getLocalOrders = () => {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const setLocalOrders = (orders) => {
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
};

const mergeOrders = (primary = [], secondary = []) => {
  const byId = new Map();

  [...primary, ...secondary].forEach((order) => {
    const normalized = normalizeOrder(order);
    const key =
      normalized.id ||
      `${normalized.item}:${normalized.date}:${normalized.amount}`;

    if (!byId.has(key)) {
      byId.set(key, normalized);
    }
  });

  return Array.from(byId.values());
};

export const upsertLocalOrder = (payload) => {
  const normalized = normalizeOrder(payload);
  const local = getLocalOrders().map(normalizeOrder);
  const next = [
    normalized,
    ...local.filter((order) => String(order.id) !== String(normalized.id)),
  ];
  setLocalOrders(next);
  return normalized;
};

export const listOrders = async () => {
  const localOrders = getLocalOrders().map(normalizeOrder);

  const response = await requestWithFallback(
    [
      () => httpClient.get("/api/orders/user"),
      () => httpClient.get("/api/orders"),
      () => httpClient.get("/api/user/orders"),
    ],
    () => ({ data: mergeOrders(localOrders, mockOrders) }),
  );

  const remoteOrders = unwrapCollection(response).map(normalizeOrder);
  return mergeOrders(localOrders, remoteOrders.length ? remoteOrders : mockOrders);
};
