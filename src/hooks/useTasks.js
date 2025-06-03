import { useState, useEffect } from "react";
import { DayPilot } from "@daypilot/daypilot-lite-react";

export function useTasks(updatePetState) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const savedEvents = localStorage.getItem("tasks");
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
      updatePetState("normal", "Meo đã tải lịch trình của bạn!");
    } else {
      initializeSampleEvents();
    }
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(events));
    }
  }, [events]);

  const initializeSampleEvents = () => {
    // Get current date and find the Monday of current week
    const today = DayPilot.Date.today();
    const dayOfWeek = today.getDayOfWeek();
    const mondayOfWeek = today.addDays(1 - dayOfWeek); // 1 is Monday in DayPilot

    const sampleEvents = [
      // Monday task
      {
        id: DayPilot.guid(),
        text: "Học React",
        start: mondayOfWeek.addHours(9).toString(),
        end: mondayOfWeek.addHours(11).toString(),
        backColor: "#cc4125", // HIGH priority
        priority: "HIGH",
        status: "todo",
        description: "Học về React hooks và state management"
      },

      // Tuesday task
      {
        id: DayPilot.guid(),
        text: "Giải tích",
        start: mondayOfWeek.addDays(1).addHours(14).toString(),
        end: mondayOfWeek.addDays(1).addHours(16).toString(),
        backColor: "#cc4125", // HIGH priority
        priority: "HIGH",
        status: "todo",
        description: "Ôn tập giải tích cho kỳ thi giữa kỳ"
      },

      // Friday task
      {
        id: DayPilot.guid(),
        text: "Đi cafe với bạn",
        start: mondayOfWeek.addDays(4).addHours(15).toString(),
        end: mondayOfWeek.addDays(4).addHours(17).toString(),
        backColor: "#6aa84f", // LOW priority
        priority: "LOW",
        status: "todo",
        description: "Gặp mặt và trò chuyện với bạn bè"
      }
    ];

    setEvents(sampleEvents);
    localStorage.setItem("tasks", JSON.stringify(sampleEvents));
    updatePetState("happy", "Meo đã tải lịch trình của bạn!");
  };

  const addTask = (newEvent) => {
    setEvents((prev) => [...prev, newEvent]);
    updatePetState("happy", "Bạn đã lập kế hoạch mới, tuyệt vời lắm!");
  };

  const updateTask = (updatedEvent) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
    );
    updatePetState("happy", "Bạn đang cập nhật kế hoạch, tốt lắm!");
  };

  const deleteTask = (id) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
    updatePetState("sad", "Bạn đã xóa một nhiệm vụ, Meo hơi buồn...");
  };

  const changeStatus = (taskId, isCompleted) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === taskId
          ? { ...event, status: isCompleted ? "done" : "todo" }
          : event
      )
    );
    updatePetState(
      isCompleted ? "happy" : "normal",
      isCompleted
        ? "Thật tuyệt vời! Bạn đã hoàn thành một nhiệm vụ!"
        : "Bạn đã hủy hoàn thành nhiệm vụ. Cố gắng lên nhé!"
    );
  };

  return {
    events,
    addTask,
    updateTask,
    deleteTask,
    changeStatus,
  };
}
