import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
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

const formatTime = (dateString) => {
  if (!dateString || dateString === "Just now") return "Just now";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return dateString;
  }
};

const normalizeNotification = (item) => ({
  id: String(item?.id || item?._id || item?.notification_id || item?.notificationId || ""),
  title: item?.title || item?.notification_title || "Notification",
  description: item?.description || item?.message || "",
  time: formatTime(item?.time || item?.createdAt || item?.created_at || "Just now"),
  type: item?.type || (item?.priority === "high" ? "critical" : "info"),
  unread: resolveUnread(item),
  vehicleId: item?.vehicle_id || "",
  incidentProof: Array.isArray(item?.incident_proof) ? item.incident_proof : [],
});

const getMockBackedNotifications = () => {
  const local = getLocalNotifications();
  const base = local.length ? local : mockNotifications;
  return base.map(normalizeNotification);
};

export const listNotifications = async () => {
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

  if (!userId) return [];

  try {
    const response = await httpClient.get(`/api/notifications/${userId}`);
    const rawData = response?.data?.data || response?.data || [];
    return Array.isArray(rawData) ? rawData.map(normalizeNotification) : [];
  } catch (error) {
    console.error("Error fetching notifications from backend:", error);
    return [];
  }
};

export const markNotificationAsRead = async (notificationId) => {
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

  if (!userId || !notificationId) return null;

  try {
    const response = await httpClient.post(`/api/notifications/user/seen-notification`, {
      user_id: userId,
      notification_id: notificationId,
    });
    return response?.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return null;
  }
};

export const markAllNotificationsAsRead = async () => {
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

  if (!userId) return false;

  try {
    // Get all notifications to find unread ones and mark them all as read sequentially
    const notifications = await listNotifications();
    const unreadNotifications = notifications.filter((n) => n.unread);

    if (unreadNotifications.length > 0) {
      await Promise.all(
        unreadNotifications.map((n) =>
          httpClient.post(`/api/notifications/user/seen-notification`, {
            user_id: userId,
            notification_id: n.id,
          })
        )
      );
    }
    return true;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return false;
  }
};
