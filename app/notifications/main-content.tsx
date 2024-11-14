"use client";
import CompanyImage from "@/app/assets/company.png";
import No_Post from "@/app/assets/no_post.svg";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { notification, user } from "@prisma/client";
import { Avatar } from "@radix-ui/react-avatar";
import axios from "axios";
import { Loader, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { formatDate, transformDateString } from "../utils/utils";

export type NotificationWithUser = notification & { user: user };

const NotificationMainContent = () => {
  const notificationFilters = ["All", "Jobs", "My posts"];
  const [currentFilter, setCurrentFilter] = useState("All");
  const [notifications, setNotifications] = useState<NotificationWithUser[]>(
    []
  );
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const pageSize = 10;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const filter = params.get("filter");
    if (filter) {
      setCurrentFilter(filter.charAt(0).toUpperCase() + filter.slice(1));
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [currentFilter, page]);

  const fetchNotifications = async () => {
    if (!hasMore) return; // Stop fetching if there are no more items to load

    setLoading(true);
    const response = await axios.get(
      `/api/notification?filter=${currentFilter.toLowerCase()}&page=${page}`
    );
    const data = await response.data;
    if (response.status === 200) {
      setNotifications((prev) => [...prev, ...data.notifications]);
      if (data.notifications.length < pageSize) {
        setHasMore(false);
      }
    }
    setLoading(false);
  };

  const lastNotificationRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading || !hasMore) return; // Stop observing if loading or no more items
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
    await axios.delete(`/api/notification`, { data: { notificationId: id } });
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

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
              setHasMore(true); // Reset hasMore when filter changes
            }}
          >
            <p className="px-2 text-sm">{filter}</p>
          </Button>
        ))}
      </div>
      <div
        className={`mb-4 rounded-lg border-[1.5px] border-[#DADEE2] bg-white shadow-sm`}
      >
        {loading ? (
          <div className="flex items-center justify-center p-6">
            <Loader className="size-8 animate-spin" />
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <React.Fragment key={notification.id}>
              <div
                key={notification.id}
                className={`flex justify-between ${
                  notification.is_read
                    ? "bg-white hover:bg-gray-100"
                    : "bg-[#D7E9FB] hover:bg-[#C3DDF8]"
                }`}
              >
                <div className="flex cursor-pointer flex-col justify-center space-y-3 py-8 pl-8">
                  <div className="flex space-x-4">
                    {notification.type === "job_posting" ? (
                      <>
                        <div className="mt-6 size-2 w-[10px] rounded-full bg-blue-500" />
                        <Image
                          src={CompanyImage}
                          alt=""
                          width={60}
                          height={60}
                          className="h-fit object-cover"
                        />
                      </>
                    ) : (
                      <Avatar className="size-10">
                        <AvatarImage
                          src={notification.user.image ?? ""}
                          className="rounded-full"
                        />
                        <AvatarFallback className="bg-blue-300 text-lg text-white">
                          {notification.user.name
                            .split(" ")
                            .pop()
                            ?.charAt(0)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className="flex flex-col space-y-2">
                      <p
                        className="text-sm"
                        dangerouslySetInnerHTML={{
                          __html: notification.content,
                        }}
                      />
                      <button className="w-fit self-start rounded-full px-4 py-2 text-sm font-bold text-blue-500 outline outline-1 outline-blue-500 hover:text-blue-700 hover:outline-2 hover:outline-blue-700">
                        View Jobs
                      </button>
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
    </div>
  );
};

export default NotificationMainContent;
