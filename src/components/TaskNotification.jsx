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

const TaskNotificationCenter = ({ tasks = [] }) => {
  const [notifiedEndIds, setNotifiedEndIds] = useState([]);
  const [notifiedStartIds, setNotifiedStartIds] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const thresholdEnd = subMinutes(now, -20);
      const startWindow = {
        start: subMinutes(now, 2),
        end: now,
      };

      tasks.forEach((task) => {
        // const start = parseISO(task.start);
        const end = parseISO(task.end);

        const isStartingNow =
          isAfter(now, startWindow.start) &&
          isBefore(now, startWindow.end) &&
          !notifiedStartIds.includes(task.id);

        if (isStartingNow) {
          toast(`🔔 Đến giờ: ${task.text}`, {
            type:
              task.priority === "HIGH"
                ? "info"
                : task.priority === "MEDIUM"
                  ? "default"
                  : "success",
          });
          setNotifiedStartIds((prev) => [...prev, task.id]);
        }

        const isEndingSoon =
          isAfter(end, now) &&
          isBefore(end, thresholdEnd) &&
          !notifiedEndIds.includes(task.id);

        if (isEndingSoon) {
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
          setNotifiedEndIds((prev) => [...prev, task.id]);
        }
      });
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [tasks, notifiedEndIds, notifiedStartIds]);

  const todayTasks = tasks.filter((task) =>
    task.start && typeof task.start === 'string' &&
    isSameDay(parseISO(task.start), new Date())
  );

  return (
    <div className="relative inline-block text-left">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-700 hover:text-blue-600 focus:outline-none"
      >
        🔔
        {todayTasks.length > 0 && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 border rounded-xl shadow bg-white z-10">
          <div className="p-3 border-b font-semibold text-blue-600">
            Công việc hôm nay
          </div>
          <div className="max-h-64 overflow-y-auto">
            {todayTasks.length === 0 ? (
              <p className="p-4 text-sm text-gray-500">
                Không có task nào hôm nay
              </p>
            ) : (
              todayTasks.map((task) => (
                <div key={task.id} className="p-4 border-b hover:bg-gray-50">
                  <div className="text-sm font-semibold">{task.text}</div>
                  <div className="text-xs text-gray-500">
                    {format(parseISO(task.start), "HH:mm")} -{" "}
                    {format(parseISO(task.end), "HH:mm")}
                  </div>
                  <div
                    className={`text-xs font-medium mt-1 ${
                      task.priority === "HIGH"
                        ? "text-red-500"
                        : task.priority === "MEDIUM"
                          ? "text-yellow-500"
                          : task.priority === "LOW"
                            ? "text-green-500"
                            : "text-blue-500"
                    }`}
                  >
                    Ưu tiên: {task.priority}
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
