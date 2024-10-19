import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteNotification,
  fetchNotifications,
  updateNotificationReadStatus,
} from "@/lib/http";
import { INotification } from "@/types";
import { useAuth } from "@/providers/user.context";
import notificationlogo from "../assets/airbnb-notification.png";
import { X } from "lucide-react";

const NotificationPage: React.FC = () => {
  const { loggedInUser } = useAuth();
  const userId = loggedInUser?.user._id;
  const queryClient = useQueryClient();
  const [visuallyUnreadIds, setVisuallyUnreadIds] = useState<string[]>([]);

  const {
    data: notifications,
    isLoading,
    error: fetchError,
  } = useQuery<INotification[], Error>({
    queryKey: ["notifications", userId],
    queryFn: () => fetchNotifications(userId as string),
    enabled: !!userId,
    retry: 1,
  });

  const updateNotificationMutation = useMutation({
    mutationFn: (notificationIds: string[]) =>
      Promise.all(
        notificationIds.map((id) => updateNotificationReadStatus(id, true))
      ),
    onSuccess: (_, updatedIds) => {
      queryClient.setQueryData<INotification[] | undefined>(
        ["notifications", userId],
        (oldData) =>
          oldData?.map((n) =>
            updatedIds.includes(n._id) ? { ...n, read: true } : n
          ) || []
      );
    },
    onError: (err) => {
      console.error("Error updating notification read status:", err);
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: (notificationId: string) => deleteNotification(notificationId),
    onSuccess: (_, deletedNotificationId) => {
      queryClient.setQueryData<INotification[] | undefined>(
        ["notifications", userId],
        (oldData) =>
          oldData?.filter((n) => n._id !== deletedNotificationId) || []
      );
      setVisuallyUnreadIds((prev) =>
        prev.filter((id) => id !== deletedNotificationId)
      );
      localStorage.setItem(
        `visually-unread-${userId}`,
        JSON.stringify(
          visuallyUnreadIds.filter((id) => id !== deletedNotificationId)
        )
      );
    },
    onError: (err) => {
      console.error("Error deleting notification:", err);
    },
  });

  useEffect(() => {
    if (notifications) {
      const storedUnreadIds = localStorage.getItem(`visually-unread-${userId}`);
      if (storedUnreadIds) {
        setVisuallyUnreadIds(JSON.parse(storedUnreadIds));
      } else {
        const unreadIds = notifications
          .filter((n) => !n.read)
          .map((n) => n._id);
        setVisuallyUnreadIds(unreadIds);
        localStorage.setItem(
          `visually-unread-${userId}`,
          JSON.stringify(unreadIds)
        );
      }

      const actualUnreadIds = notifications
        .filter((n) => !n.read)
        .map((n) => n._id);
      if (actualUnreadIds.length > 0) {
        updateNotificationMutation.mutate(actualUnreadIds);
      }
    }
  }, [notifications, userId]);

  useEffect(() => {
    return () => {
      localStorage.removeItem(`visually-unread-${userId}`);
    };
  }, [userId]);

  if (isLoading) {
    return <div className="text-center">Loading notifications...</div>;
  }

  if (!notifications || notifications.length === 0) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="p-6 w-[50%]">
          <h1 className="text-4xl font-semibold mb-10">Notifications</h1>
          <p className="text-center text-gray-500">You're all caught up</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="text-center text-red-500">
        Error fetching notifications. Please try again later.
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center p-4">
      <div className="p-6 w-[50%]">
        <h1 className="text-4xl font-semibold mb-10">Notifications</h1>
        <ul className="space-y-4">
          {notifications
            .slice()
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((notification) => (
              <li
                key={notification._id}
                className={`flex items-start gap-4 py-4 ${
                  visuallyUnreadIds.includes(notification._id)
                    ? "bg-gray-100"
                    : ""
                } rounded-lg shadow-sm`}
              >
                <img
                  className="ml-6 w-14 h-14 rounded-full"
                  src={notificationlogo}
                  alt="notification logo"
                />
                <div className="flex flex-1">
                  <div className="flex-1 flex flex-col">
                    <p
                      className={`font-semibold text-sm ${
                        visuallyUnreadIds.includes(notification._id)
                          ? "text-black"
                          : "text-gray-500"
                      }`}
                    >
                      {notification.message}
                    </p>
                    <small className="text-gray-500">
                      {new Date(notification.createdAt).toLocaleString()}
                    </small>
                  </div>
                  <button
                    onClick={() =>
                      deleteNotificationMutation.mutate(notification._id)
                    }
                    className="ml-4"
                    disabled={deleteNotificationMutation.isPending}
                  >
                    <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                  </button>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default NotificationPage;
