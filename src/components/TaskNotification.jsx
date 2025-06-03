import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  format,
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
  // Khi khởi tạo, load từ localStorage và reverse để 'mới nhất' lên trước
  const [notification, setNotification] = useState(
    (JSON.parse(localStorage.getItem("notifications")) || []).reverse()
  );
  const [lastPetMood, setLastPetMood] = useState(petMood);

  // 1. Bắt ngay khi petMood (props) thay đổi, tạo notification mới cho pet
  useEffect(() => {
    if (petMood && petMood !== lastPetMood) {
      const moodTextMap = {
        happy: "vui vẻ",
        sad: "buồn",
        angry: "giận",
        sleeping: "ngủ",
        normal: "bình thường",
      };
      const moodText = moodTextMap[petMood] || "bình thường";

      const petNotif = {
        id: `pet-${Date.now()}`,
        text: `${petName} đang ${moodText}`,
        start: new Date().toISOString(),
        end: new Date().toISOString(),
        priority: "LOW",
        type: "pet",
        read: false,
      };

      // Toast popup
      toast(petNotif.text, {
        type: "info",
        icon: "🐾",
      });

      // Phát âm thanh (VD: meow.mp3 đặt trong public)
      const sound = new Audio("/../../public/notif-sounds.mp3");
      sound.volume = 0.5;
      sound.play().catch(() => {});

      // Lấy raw từ localStorage (chưa reverse)
      const existingRaw = JSON.parse(localStorage.getItem("notifications")) || [];
      // Gộp vào, lọc cũ quá 7 ngày
      const updatedRaw = [...existingRaw, petNotif].filter(
        (n) => Date.now() - new Date(n.start).getTime() < 7 * 24 * 60 * 60 * 1000
      );
      localStorage.setItem("notifications", JSON.stringify(updatedRaw));
      // Cập nhật state (reverse để mới nhất lên trên)
      setNotification([...updatedRaw].reverse());

      setLastPetMood(petMood);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [petMood]);

  // 2. useEffect chính để kiểm tra tasks start/end
  useEffect(() => {
    const intervalMs = 30 * 1000; // 30 giây (có thể chỉnh lại)
    const interval = setInterval(() => {
      const now = new Date();
      const thresholdEnd = subMinutes(now, -5);
      const startWindow = {
        start: subMinutes(now, 2),
        end: now,
      };

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
          toast(`⏰ Đến giờ bắt đầu: ${task.text}`, {
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
          const priorityEmoji = {
            HIGH: "🔥",
            MEDIUM: "⚠️",
            LOW: "💡"
          }[task.priority] || "⏰";
          toast(`${priorityEmoji} Sắp hết hạn: ${task.text}`, {
            type:
              task.priority === "HIGH"
                ? "error"
                : task.priority === "MEDIUM"
                  ? "warning"
                  : "default",
          });
        }
      });

      const oneWeek = 7 * 24 * 60 * 60 * 1000;

      if (newNotifs.length > 0) {
        const updatedNotifs = [...existingNotifs, ...newNotifs];
        const filteredNotifs = updatedNotifs.filter((n) => {
          const time = new Date(n.start).getTime();
          return Date.now() - time < oneWeek;
        });

        // Merge giữ read cũ
        const merged = filteredNotifs.map((newNotif) => {
          const existing = notification.find(
            (oldNotif) =>
              oldNotif.id === newNotif.id && oldNotif.type === newNotif.type
          );
          return existing ? { ...newNotif, read: existing.read } : newNotif;
        });

        // Phát âm thanh cho task mới (VD: notify-task.mp3)
        const taskSound = new Audio("/notify-task.mp3");
        taskSound.volume = 0.5;
        taskSound.play().catch(() => {});

        // Lưu raw (chưa reverse) vào localStorage
        localStorage.setItem("notifications", JSON.stringify(merged));
        // Cập nhật state (reverse để mới nhất lên trên)
        setNotification([...merged].reverse());
      } else {
        const filtered = existingNotifs.filter(
          (n) => Date.now() - new Date(n.start).getTime() < oneWeek
        );
        const merged = filtered.map((notif) => {
          const existing = notification.find(
            (n) => n.id === notif.id && n.type === notif.type
          );
          return existing ? { ...notif, read: existing.read } : notif;
        });
        localStorage.setItem("notifications", JSON.stringify(merged));
        setNotification([...merged].reverse());
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [tasks, notification]);

  // 3. Khi mở/đóng panel
  const toggleOpen = () => {
    const next = !isOpen;
    setIsOpen(next);
    if (next) {
      setFilterType("all");
      setFilteredNotifications([...notification]);
    }
  };

  // 4. Lọc theo tab
  const handleFilter = (type) => {
    setFilterType(type);
    setIsOpen(true);
    if (type === "all") {
      setFilteredNotifications([...notification]);
    } else {
      setFilteredNotifications(
        notification.filter((notif) => notif.type === type)
      );
    }
  };

  // 5. Click vào 1 notification
  const handleNotificationClick = (notifId) => {
    setNotification((prev) => {
      const updated = prev.map((notif) =>
        notif.id === notifId ? { ...notif, read: true } : notif
      );
      if (isOpen) {
        if (filterType === "all") {
          setFilteredNotifications(updated);
        } else {
          setFilteredNotifications(
            updated.filter((notif) => notif.type === filterType)
          );
        }
      }
      // Lưu raw (reverse ngược) vào localStorage
      localStorage.setItem(
        "notifications",
        JSON.stringify([...updated].reverse())
      );
      return updated;
    });
  };

  // 6. Đánh dấu tất cả là đã đọc
  const handleMarkAllRead = () => {
    // Cập nhật state.notification: set read=true cho tất cả
    setNotification((prev) => {
      const allRead = prev.map((notif) => ({ ...notif, read: true }));
      // Cập nhật filteredNotifications ngay lập tức
      if (isOpen) {
        if (filterType === "all") {
          setFilteredNotifications(allRead);
        } else {
          setFilteredNotifications(
            allRead.filter((notif) => notif.type === filterType)
          );
        }
      }
      // Lưu raw (reverse ngược) vào localStorage
      localStorage.setItem(
        "notifications",
        JSON.stringify([...allRead].reverse())
      );
      return allRead;
    });
  };

  const unreadCount = notification.filter((notif) => !notif.read).length;

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleOpen}
        className="relative p-2 text-gray-700 hover:text-blue-600 focus:outline-none"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 border rounded-xl shadow bg-white z-10">
          {/* Header với nút 'Đánh dấu tất cả là đã đọc' */}
          <div className="flex items-center justify-between p-3 border-b">
            <span className="font-semibold text-blue-600">Thông báo</span>
            <button
              onClick={handleMarkAllRead}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Đánh dấu tất cả đã đọc
            </button>
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

          {/* Danh sách thông báo */}
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
                          : "text-green-500"
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
    </div>
  );
};

export default TaskNotificationCenter;
