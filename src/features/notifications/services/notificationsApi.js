import httpClient from "../../shared/api/httpClient";
import {
  requestWithFallback,
  unwrapCollection,
} from "../../shared/api/requestWithFallback";
import { mockNotifications } from "../../shared/mock/userSystemMockData";

const NOTIFICATIONS_STORAGE_KEY = "dv_user_notifications_mock";

const getLocalNotifications = () => {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const setLocalNotifications = (notifications) => {
  localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
};

const resolveUnread = (item) => {
  if (typeof item?.unread === "boolean") {
    return item.unread;
  }

  if (typeof item?.seen_status === "boolean") {
    return !item.seen_status;
  }

  if (typeof item?.is_read === "boolean") {
    return !item.is_read;
  }

  return true;
};

const normalizeNotification = (item) => ({
  id: String(item?.id || item?._id || item?.notification_id || item?.notificationId || ""),
  title: item?.title || item?.notification_title || "Notification",
  description: item?.description || item?.message || "",
  time: item?.time || item?.createdAt || item?.created_at || "Just now",
  type: item?.type || (item?.priority === "high" ? "critical" : "info"),
  unread: resolveUnread(item),
});

const getMockBackedNotifications = () => {
  const local = getLocalNotifications();
  const base = local.length ? local : mockNotifications;
  return base.map(normalizeNotification);
};

export const listNotifications = async () => {
  const local = getLocalNotifications();
  if (local.length) {
    return local.map(normalizeNotification);
  }

  const response = await requestWithFallback(
    [
      () => httpClient.get("/api/notifications"),
      () => httpClient.get("/api/notifications/list"),
      () => httpClient.get("/api/user/notifications"),
    ],
    () => ({ data: getMockBackedNotifications() }),
  );

  return unwrapCollection(response).map(normalizeNotification);
};

export const markNotificationAsRead = async (notificationId) => {
  const response = await requestWithFallback(
    [
      () => httpClient.patch(`/api/notifications/${notificationId}/read`),
      () => httpClient.post(`/api/notifications/${notificationId}/read`),
      () => httpClient.patch(`/api/user/notifications/${notificationId}`, { unread: false }),
    ],
    () => {
      const updated = getMockBackedNotifications().map((item) =>
        item.id === String(notificationId)
          ? { ...item, unread: false, seen_status: true, is_read: true }
          : item,
      );
      setLocalNotifications(updated);
      return { data: updated.find((item) => item.id === String(notificationId)) };
    },
  );

  return normalizeNotification(response?.data || response);
};

export const markAllNotificationsAsRead = async () => {
  await requestWithFallback(
    [
      () => httpClient.patch("/api/notifications/read-all"),
      () => httpClient.post("/api/notifications/read-all"),
      () => httpClient.patch("/api/user/notifications", { unread: false }),
    ],
    () => {
      const updated = getMockBackedNotifications().map((item) => ({
        ...item,
        unread: false,
        seen_status: true,
        is_read: true,
      }));
      setLocalNotifications(updated);
      return { data: { success: true } };
    },
  );

  return true;
};
