"use client";
import { notification } from "@prisma/client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";
import { useShowToastWithCloseButton } from "../components/toastWithCloseButton";
import { usePusher } from "./PusherContext";

const NotificationContext = createContext<{
  notificationCount: number;
  notifications: notification[];
  setNotificationCount: React.Dispatch<React.SetStateAction<number>>;
  setNotifications: React.Dispatch<React.SetStateAction<notification[]>>;
} | null>(null);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data: session } = useSession();
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState<notification[]>([]);
  const showToast: (message: string) => void = useShowToastWithCloseButton();
  const { bindEvent, unbindEvent, pusher } = usePusher();

  useEffect(() => {
    if (session?.user?.id) {
      const persistedCount = sessionStorage.getItem(
        `notificationCount-${session.user.id}`
      );
      if (persistedCount) {
        setNotificationCount(persistedCount ? Number(persistedCount) : 0);
      } else {
        const fetchUnreadNotifications = async () => {
          try {
            const { data } = await axios.get("/api/notification");
            const unreadCount = data.notifications.filter(
              (notification: notification) => !notification.is_read
            ).length;
            sessionStorage.setItem(
              `notificationCount-${session.user.id}`,
              String(unreadCount)
            );
            setNotificationCount(unreadCount);
          } catch (error) {
            console.error("Failed to fetch notifications", error);
          }
        };

        fetchUnreadNotifications();
      }
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (session?.user?.id && pusher) {
      const handleNotification = async (data: unknown) => {
        const { message, userId, type } = data as {
          message: string;
          userId: string;
          type: string;
        };
        showToast(message);
        setNotificationCount((prev) => {
          const newCount = prev + 1;
          if (session?.user?.id) {
            sessionStorage.setItem(
              `notificationCount-${session.user.id}`,
              String(newCount)
            );
          }
          return newCount;
        });

        const response = await axios.post("/api/notification", {
          message,
          type,
          userId,
        });
        const { notification } = response.data;

        setNotifications((prevNotifications) => {
          const updatedNotifications = [...prevNotifications, notification];
          if (session?.user?.id) {
            sessionStorage.setItem(
              `notifications-${session.user.id}`,
              JSON.stringify(updatedNotifications)
            );
          }
          return updatedNotifications;
        });
      };

      bindEvent("new-notification", handleNotification);
      console.log("Subscribed to new-notification event");

      return () => {
        console.log("Unsubscribed from new-notification event");
        unbindEvent("new-notification");
        sessionStorage.removeItem(`notifications-${session?.user?.id}`);
        sessionStorage.removeItem(`notificationCount-${session?.user?.id}`);
      };
    }
  }, [session?.user?.id, pusher]);

  return (
    <NotificationContext.Provider
      value={{
        notificationCount,
        setNotificationCount,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
