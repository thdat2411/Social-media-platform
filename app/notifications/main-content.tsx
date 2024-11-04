"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { notification } from "@prisma/client";
import axios from "axios";
import { Loader, Trash2 } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { formatDate, transformDateString } from "../utils/utils";

const NotificationMainContent = () => {
  const notificationFilters = ["All", "Jobs", "My posts"];
  const [currentFilter, setCurrentFilter] = useState("All");
  const [notifications, setNotifications] = useState<notification[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    const response = await axios.get(
      `/api/notification?filter=${currentFilter.toLowerCase()}&page=${page}`
    );
    const data = await response.data;
    if (response.status === 200) {
      setNotifications((prev) => [...prev, ...data.notifications]);
    }
    setLoading(false);
  };

  const handleScroll = useCallback(() => {
    const bottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight;
    if (bottom && !loading) {
      setPage((prev) => prev + 1);
    }
  }, [loading]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div
      className="mx-4 w-1/2 overflow-y-auto pb-6 max-[1000px]:w-1/2 max-[700px]:mx-0 max-[700px]:my-2 max-[700px]:w-full"
      // style={{ scrollbarWidth: "none" }}
    >
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
            }}
          >
            <p className="px-2 text-sm">{filter}</p>
          </Button>
        ))}
      </div>
      <div className="mb-4 rounded-lg border-[1.5px] border-[#DADEE2] bg-white shadow-sm">
        {notifications.map((notification, index) => (
          <>
            <div className="flex justify-between hover:bg-gray-100">
              <div
                key={notification.id}
                className="flex cursor-pointer flex-col items-center justify-center py-8 pl-8"
              >
                <p className="text-sm">{notification.content}</p>
              </div>
              <div className="flex flex-col items-center justify-center space-y-2 py-8 pr-6">
                <p className="text-sm text-gray-500">
                  {transformDateString(formatDate(notification.created_at))}
                </p>
                <Button
                  variant="ghost"
                  className="rounded-full hover:bg-gray-200"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
            {index !== notifications.length - 1 && <Separator />}
          </>
        ))}
        {loading && (
          <div className="flex items-center justify-center p-6">
            <Loader className="size-8 animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationMainContent;
