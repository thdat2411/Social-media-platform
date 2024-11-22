"use client";
import CommentIcon from "@/app/assets/comment.png";
import JobApplicationIcon from "@/app/assets/job-application.png";
import No_Post from "@/app/assets/No_Post.svg";
import PostIcon from "@/app/assets/post_notification.png";
import UpdateIcon from "@/app/assets/post_update.png";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { notification, user } from "@prisma/client";
import axios from "axios";
import { Loader, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { formatDate, transformDateString } from "../utils/utils";

export type NotificationWithUser = notification & { user: user };

interface NotificationMainContentProps {
  user: user;
}

const NotificationMainContent = ({ user }: NotificationMainContentProps) => {
  const notificationFilters = ["All", "Jobs", "My posts"];
  const [currentFilter, setCurrentFilter] = useState("All");
  const [notifications, setNotifications] = useState<NotificationWithUser[]>(
    []
  );
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const pageSize = 15;

  const userId = user.id;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const filter = params.get("filter");
    if (filter) {
      setCurrentFilter(filter.charAt(0).toUpperCase() + filter.slice(1));
    }
    // const storedNotifications = sessionStorage.getItem(
    //   `notifications-${userId}`
    // );
    // if (storedNotifications) {
    //   setNotifications(JSON.parse(storedNotifications));
    // }
  }, [userId]);

  useEffect(() => {
    fetchNotifications();
  }, [currentFilter, page]);

  const fetchNotifications = async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `/api/notification?filter=${currentFilter.toLowerCase()}&page=${page}`
      );
      const data = await response.data;

      if (response.status === 200) {
        const newNotifications = data.notifications;

        setNotifications((prev) => {
          const updatedNotifications = [...prev, ...newNotifications];
          sessionStorage.setItem(
            `notifications-${userId}`,
            JSON.stringify(updatedNotifications)
          );
          return updatedNotifications;
        });

        if (newNotifications.length < pageSize) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
    setLoading(false);
  };

  const lastNotificationRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading || !hasMore) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore]
  );

  const handleDeleteNotification = async (id: string) => {
    try {
      await axios.delete(`/api/notification`, { data: { notificationId: id } });
      setNotifications((prev) => {
        const updatedNotifications = prev.filter((n) => n.id !== id);
        localStorage.setItem(
          `notifications-${userId}`,
          JSON.stringify(updatedNotifications)
        );
        return updatedNotifications;
      });
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const handleClickNotification = async (id: string) => {
    try {
      const response = await axios.put(
        `/api/notification?notificationId=${id}`
      );
      if (response.status !== 200) {
        return;
      }
      setNotifications((prev) => {
        const updatedNotifications = prev.map((n) => {
          if (n.id === id) {
            return { ...n, is_read: true };
          }
          return n;
        });
        sessionStorage.setItem(
          `notifications-${userId}`,
          JSON.stringify(updatedNotifications)
        );
        return updatedNotifications;
      });
    } catch (error) {
      console.error("Failed to update notification:", error);
    }
  };

  if (loading) {
    return (
      <div className="mx-4 w-1/2 overflow-y-auto pb-6 max-[1000px]:w-1/2 max-[700px]:mx-0 max-[700px]:my-2 max-[700px]:w-full">
        <div className="mb-4 rounded-lg border-[1.5px] border-[#DADEE2] bg-white px-6 py-4 shadow-sm">
          <div className="flex animate-spin items-center justify-center">
            <Loader className="size-8 text-blue-500" />
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="mx-4 w-1/2 overflow-y-auto pb-6 max-[1000px]:w-1/2 max-[700px]:mx-0 max-[700px]:my-2 max-[700px]:w-full">
        <div className="mb-4 rounded-lg border-[1.5px] border-[#DADEE2] bg-white px-6 py-4 shadow-sm">
          {notificationFilters.map((filter) => (
            <Button
              key={filter}
              variant={currentFilter === filter ? "default" : "outline"}
              className={`mr-4 rounded-full border-none ${
                currentFilter !== filter
                  ? "outline outline-1 outline-gray-400 hover:outline-2 hover:outline-gray-500"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
              onClick={() => {
                setCurrentFilter(filter);
                setNotifications([]);
                setPage(1);
                setHasMore(true);
              }}
            >
              <p className="px-2 text-sm">{filter}</p>
            </Button>
          ))}
        </div>
        <div
          className={`mb-4 rounded-lg border-[1.5px] border-[#DADEE2] bg-white shadow-sm`}
        >
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <div
                  onClick={() => {
                    handleClickNotification(notification.id);
                  }}
                  className={`flex justify-between ${
                    notification.is_read
                      ? "bg-white hover:bg-gray-100"
                      : "bg-[#D7E9FB] hover:bg-[#C3DDF8]"
                  }`}
                >
                  <div
                    className={`flex w-full cursor-pointer flex-col ${!notification.is_read ? "py-8 pl-4" : "py-8 pl-10"} `}
                  >
                    <div className="flex space-x-4">
                      {!notification.is_read && (
                        <div className="size-2 self-center rounded-full bg-blue-500 p-1"></div>
                      )}
                      <Image
                        src={
                          notification.type === "job_posting"
                            ? PostIcon
                            : notification.type === "job_posting_update"
                              ? UpdateIcon
                              : notification.type === "job_apply"
                                ? JobApplicationIcon
                                : CommentIcon
                        }
                        alt=""
                        width={60}
                        height={60}
                        className={`${notification.type === "job_apply" ? "size-11" : "size-12"}`}
                        objectFit="cover"
                      />
                      <div className="flex w-full flex-col space-y-2">
                        <p
                          className="text-sm"
                          dangerouslySetInnerHTML={{
                            __html: notification.content,
                          }}
                        />
                        {notification.type === "job_posting" && (
                          <button className="w-fit self-start rounded-full px-4 py-2 text-sm font-bold text-blue-500 outline outline-1 outline-blue-500 hover:text-blue-700 hover:outline-2 hover:outline-blue-700">
                            View Jobs
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center space-y-2 py-8 pr-6">
                    <p className="text-sm text-gray-500">
                      {transformDateString(formatDate(notification.created_at))}
                    </p>
                    <Button
                      onClick={() => handleDeleteNotification(notification.id)}
                      variant="ghost"
                      className="rounded-full hover:bg-gray-200"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
                {index !== notifications.length - 1 && <Separator />}
              </React.Fragment>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center space-y-4 p-8">
              <Image
                src={No_Post}
                alt=""
                width={260}
                height={260}
                className="object-cover"
              />
              <p className="text-2xl font-medium">No new post activities</p>
            </div>
          )}
          {hasMore && <div ref={lastNotificationRef}></div>}
        </div>
        {loading && (
          <div className="flex animate-spin items-center justify-center">
            <Loader className="size-8 text-blue-500" />
          </div>
        )}
      </div>
    );
  }
};

export default NotificationMainContent;
