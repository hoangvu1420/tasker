import { useState, useEffect } from "react";

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
    const sampleEvents = [ /* ... */ ];
    setEvents(sampleEvents);
    localStorage.setItem("tasks", JSON.stringify(sampleEvents));
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
