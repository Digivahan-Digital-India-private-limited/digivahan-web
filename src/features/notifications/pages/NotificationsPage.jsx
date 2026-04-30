import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import NotificationItem from "../components/NotificationItem";
import {
  listNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../services/notificationsApi";

const NotificationsPage = () => {
  const queryClient = useQueryClient();
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["user-notifications"],
    queryFn: listNotifications,
  });

  const unreadCount = notifications.filter((item) => item.unread).length;

  const markOneMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: (_, notificationId) => {
      queryClient.setQueryData(["user-notifications"], (prev = []) =>
        prev.map((item) =>
          item.id === String(notificationId)
            ? { ...item, unread: false }
            : item,
        ),
      );
    },
  });

  const markAllMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.setQueryData(["user-notifications"], (prev = []) =>
        prev.map((item) => ({ ...item, unread: false })),
      );
      toast.success("All notifications marked as read");
    },
  });

  const handleMarkRead = async (notificationId) => {
    try {
      await markOneMutation.mutateAsync(notificationId);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to mark notification as read");
    }
  };

  const handleMarkAllRead = async () => {
    if (!unreadCount) {
      return;
    }

    try {
      await markAllMutation.mutateAsync();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to mark all notifications as read");
    }
  };

  return (
    <div className="space-y-3">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Notifications</h2>
            <p className="text-sm text-slate-500">Recent scan alerts, reminders and emergency updates.</p>
          </div>
          <button
            type="button"
            onClick={handleMarkAllRead}
            disabled={!unreadCount || markAllMutation.isPending}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {markAllMutation.isPending ? "Updating..." : "Mark all as read"}
          </button>
        </div>
      </section>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
          Loading notifications...
        </div>
      ) : notifications.length ? (
        notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onMarkRead={handleMarkRead}
            disabled={markOneMutation.isPending}
          />
        ))
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500 shadow-sm">
          No notifications found.
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
