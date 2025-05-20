import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  format,
  isSameDay,
  parseISO,
  isAfter,
  isBefore,
  subMinutes,
} from "date-fns";
import "react-toastify/dist/ReactToastify.css";

const TaskNotificationCenter = ({ tasks = [], petMood, petName }) => {
  const [filterType, setFilterType] = useState("all");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [notification, setNotification] = useState(
    JSON.parse(localStorage.getItem("notifications")) || []
  );
  const [lastPetMood, setLastPetMood] = useState(petMood);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const thresholdEnd = subMinutes(now, -20);
      const startWindow = {
        start: subMinutes(now, 2),
        end: now,
      };

      // Load from localStorage once
      const raw = localStorage.getItem("notifications");
      const existingNotifs = raw ? JSON.parse(raw) : [];

      const notifiedStartIds = existingNotifs
        .filter((n) => n.type === "start")
        .map((n) => n.id);
      const notifiedEndIds = existingNotifs
        .filter((n) => n.type === "end")
        .map((n) => n.id);

      let newNotifs = [];

      tasks.forEach((task) => {
        const start = parseISO(task.start);
        const end = parseISO(task.end);

        const isStartingNow =
          isAfter(start, startWindow.start) &&
          isBefore(start, startWindow.end) &&
          !notifiedStartIds.includes(task.id);

        if (isStartingNow) {
          newNotifs.push({
            id: task.id,
            text: task.text,
            start: task.start,
            end: task.end,
            priority: task.priority,
            type: "start",
            read: false,
          });

          toast(`🔔 Đến giờ: ${task.text}`, {
            type:
              task.priority === "HIGH"
                ? "info"
                : task.priority === "MEDIUM"
                ? "default"
                : "success",
          });
        }

        const isEndingSoon =
          isAfter(end, now) &&
          isBefore(end, thresholdEnd) &&
          !notifiedEndIds.includes(task.id);

        if (isEndingSoon) {
          newNotifs.push({
            id: task.id,
            text: task.text,
            start: task.start,
            end: task.end,
            priority: task.priority,
            type: "end",
            read: false,
          });

          toast(`[${task.priority}] Sắp hết hạn: ${task.text}`, {
            type:
              task.priority === "HIGH"
                ? "error"
                : task.priority === "MEDIUM"
                ? "warning"
                : task.priority === "FIXED"
                ? "info"
                : "default",
          });
        }
      });

      // Handle pet mood changes
      if (petMood && petMood !== lastPetMood) {
        const moodText =
          {
            happy: "vui vẻ",
            sad: "buồn",
            angry: "giận",
            sleeping: "ngủ",
            normal: "bình thường",
          }[petMood] || "bình thường";

        const petNotif = {
          id: `pet-${Date.now()}`,
          text: `${petName} đang ${moodText}`,
          start: new Date().toISOString(),
          end: new Date().toISOString(),
          priority: "LOW",
          type: "pet",
          read: false,
        };

        newNotifs.push(petNotif);
        toast(petNotif.text, {
          type: "info",
          icon: "🐾",
        });
        setLastPetMood(petMood);
      }

      if (newNotifs.length > 0) {
        const updatedNotifs = [...existingNotifs, ...newNotifs];

        // Filter out notifications older than 7 days
        const oneWeek = 7 * 24 * 60 * 60 * 1000;
        const filteredNotifs = updatedNotifs.filter((n) => {
          const time = new Date(n.start).getTime();
          return Date.now() - time < oneWeek;
        });

        localStorage.setItem("notifications", JSON.stringify(filteredNotifs));
        setNotification(filteredNotifs);
      } else {
        // Even if no new notifs, still cleanup old ones
        const oneWeek = 7 * 24 * 60 * 60 * 1000;
        const filtered = existingNotifs.filter(
          (n) => Date.now() - new Date(n.start).getTime() < oneWeek
        );

        if (filtered.length !== existingNotifs.length) {
          localStorage.setItem("notifications", JSON.stringify(filtered));
          setNotification(filtered);
        }
      }
    }, 60 * 1000); // Every 1 minute

    return () => clearInterval(interval);
  }, [tasks, petMood, petName, lastPetMood]);

  const handleFilter = (type) => {
    setFilterType(type);
    setIsOpen(true);
    setFilteredNotifications(
      type === "all"
        ? notification
        : notification.filter((notif) => notif.type === type)
    );
  };

  const handleNotificationClick = (notifId) => {
    setNotification((prev) =>
      prev.map((notif) =>
        notif.id === notifId ? { ...notif, read: true } : notif
      )
    );
  };

  const unreadCount = notification.filter((notif) => !notif.read).length;

  return (
    <div className="relative inline-block text-left">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-700 hover:text-blue-600 focus:outline-none"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 border rounded-xl shadow bg-white z-10">
          <div className="p-3 border-b font-semibold text-blue-600">
            Thông báo
          </div>

          {/* Tabs */}
          <div className="flex justify-around border-b text-sm">
            {["all", "start", "end", "pet"].map((type) => (
              <button
                key={type}
                onClick={() => handleFilter(type)}
                className={`w-full py-2 font-medium ${
                  filterType === type
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-blue-500"
                }`}
              >
                {type === "all"
                  ? "Tất cả"
                  : type === "start"
                  ? "Bắt đầu"
                  : type === "end"
                  ? "Kết thúc"
                  : "Pet"}
              </button>
            ))}
          </div>

          <div className="max-h-64 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <p className="p-4 text-sm text-gray-500">Không có thông báo</p>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={`${notif.id}-${notif.type}`}
                  className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                    !notif.read ? "bg-blue-50" : ""
                  }`}
                  onClick={() => handleNotificationClick(notif.id)}
                >
                  <div className="text-sm font-semibold">
                    {notif.text}{" "}
                    {notif.type === "start"
                      ? "sắp bắt đầu"
                      : notif.type === "end"
                      ? "sắp hết hạn"
                      : "Pet"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {format(parseISO(notif.start), "HH:mm")} -{" "}
                    {format(parseISO(notif.end), "HH:mm")}
                  </div>
                  <div
                    className={`text-xs font-medium mt-1 ${
                      notif.priority === "HIGH"
                        ? "text-red-500"
                        : notif.priority === "MEDIUM"
                        ? "text-yellow-500"
                        : notif.priority === "LOW"
                        ? "text-green-500"
                        : "text-blue-500"
                    }`}
                  >
                    Ưu tiên: {notif.priority}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <ToastContainer position="bottom-left" />
    </div>
  );
};

export default TaskNotificationCenter;
