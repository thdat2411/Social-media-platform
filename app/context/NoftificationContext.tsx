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
  isNewPost: boolean;
  setIsNewPost: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data: session } = useSession();
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState<notification[]>([]);
  const [isNewPost, setIsNewPost] = useState(false);
  const showToast: (message: string) => void = useShowToastWithCloseButton();
  const {
    pusher,
    subscribeToChannel,
    unsubscribeFromChannel,
    bindEvent,
    unbindEvent,
  } = usePusher();

  // Fetch initial unread notifications and persist count
  useEffect(() => {
    if (session?.user?.id && pusher) {
      const persistedCount = sessionStorage.getItem(
        `notificationCount-${session.user.id}`
      );
      if (persistedCount) {
        setNotificationCount(Number(persistedCount));
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
  }, [session?.user?.id, pusher]);

  // Set up dynamic Pusher channel and events
  useEffect(() => {
    if (session?.user?.id && pusher) {
      const userChannel = `user-${session.user.id}`;
      const feedChannel = "feed";

      subscribeToChannel(userChannel);
      subscribeToChannel(feedChannel);

      const handleNotification = async (data: unknown) => {
        const { message, userId, type } = data as {
          message: string;
          userId: string;
          type: string;
        };

        showToast(message);

        setNotificationCount((prev) => {
          const newCount = prev + 1;
          sessionStorage.setItem(
            `notificationCount-${session.user.id}`,
            String(newCount)
          );
          return newCount;
        });

        // Persist notification
        const response = await axios.post("/api/notification", {
          message,
          type,
          userId,
        });
        const { notification } = response.data;

        setNotifications((prevNotifications) => {
          const updatedNotifications = [...prevNotifications, notification];
          sessionStorage.setItem(
            `notifications-${session.user.id}`,
            JSON.stringify(updatedNotifications)
          );
          return updatedNotifications;
        });
      };

      const handleNewPost = () => {
        setIsNewPost(true);
      };

      bindEvent(userChannel, "new-notification", handleNotification);
      bindEvent(feedChannel, "new-post", handleNewPost);

      return () => {
        unbindEvent(userChannel, "new-notification");
        unbindEvent(feedChannel, "new-post");
        unsubscribeFromChannel(userChannel);
        unsubscribeFromChannel(feedChannel);
        sessionStorage.removeItem(`notifications-${session.user.id}`);
        sessionStorage.removeItem(`notificationCount-${session.user.id}`);
      };
    }
  }, [session?.user?.id,pusher]);

  return (
    <NotificationContext.Provider
      value={{
        notificationCount,
        setNotificationCount,
        notifications,
        setNotifications,
        isNewPost,
        setIsNewPost,
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
