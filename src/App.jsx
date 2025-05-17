import { useState, useEffect } from "react";
import "./App.css";
import { DayPilot } from "@daypilot/daypilot-lite-react";
import Calendar from "./components/Calendar";
import Pet from "./components/Pet";
import TaskNotificationCenter from "./components/TaskNotification";
import { ToastContainer } from "react-toastify";

function App() {
  const [startDate, setStartDate] = useState(DayPilot.Date.today());
  const [events, setEvents] = useState([]);
  const [viewType, setViewType] = useState("Week"); // Add state for calendar view type

  // Pet state
  const [petMood, setPetMood] = useState("happy");
  const [petMessage, setPetMessage] = useState("Hôm nay Meo rất vui!");

  // Load events from local storage on initial render
  useEffect(() => {
    const savedEvents = localStorage.getItem("tasks");
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
      setPetMood("normal");
      setPetMessage("Meo đã tải lịch trình của bạn!");
    } else {
      // Initialize sample events for first time users
      const sampleEvents = [
        {
          id: 1,
          text: "Học React",
          start: "2025-04-14T09:00:00",
          end: "2025-04-14T11:00:00",
          priority: "LOW",
          description: "Học các khái niệm cơ bản về React",
        },
        {
          id: 2,
          text: "Họp nhóm",
          start: "2025-04-15T14:00:00",
          end: "2025-04-15T15:30:00",
          priority: "MEDIUM",
          description: "Thảo luận về tiến độ dự án",
        },
        {
          id: 3,
          text: "Deadline dự án",
          start: "2025-04-16T10:00:00",
          end: "2025-04-16T12:00:00",
          priority: "HIGH",
          description: "Nộp bản demo cho khách hàng",
        },
        {
          id: 4,
          text: "Lịch học hàng tuần",
          start: "2025-04-17T08:30:00",
          end: "2025-04-17T11:30:00",
          priority: "FIXED",
          description: "Lớp học lập trình nâng cao",
        },
      ];
      setEvents(sampleEvents);
      localStorage.setItem("tasks", JSON.stringify(sampleEvents));
    }
  }, []);

  // Update local storage whenever events change
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(events));
    }
  }, [events]);

  // Add a new task
  const handleAddTask = (newEvent) => {
    // Update events state
    setEvents((prevEvents) => [...prevEvents, newEvent]);
    // Update pet mood
    setPetMood("happy");
    setPetMessage("Bạn đã lập kế hoạch mới, tuyệt vời lắm!");
  };

  // Update existing task
  const handleUpdateTask = (updatedEvent) => {
    // Update events state
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
    // Update pet mood
    setPetMood("happy");
    setPetMessage("Bạn đang cập nhật kế hoạch, tốt lắm!");
  };

  // Delete task
  const handleDeleteTask = (id) => {
    // Update events state
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
    // Update pet mood
    setPetMood("sad");
    setPetMessage("Bạn đã xóa một nhiệm vụ, Meo hơi buồn...");
  };

  return (
    <>
      <div className="flex min-h-screen p-8 gap-8 bg-gray-100">
        {/* Bên trái: Thú cưng */}
        <Pet name="Mèo béo" message={petMessage} mood={petMood} />

        {/* Bên phải: DatePicker + Calendar */}
        <div className="flex-1">
          <div className="flex flex-row items-center justify-between mb-4">
            {" "}
            <div className="w-1/4">
              <input
                type="date"
                value={startDate.toString().slice(0, 10)}
                onChange={(e) =>
                  setStartDate(new DayPilot.Date(e.target.value))
                }
                className="border border-gray-300 rounded-lg p-2"
              />
            </div>
            <div className="flex-1 text-center flex justify-center items-center gap-4">
              <h1 className="text-3xl font-bold underline">
                Quản lý thời gian
              </h1>
              <select
                value={viewType}
                onChange={(e) => setViewType(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 bg-white"
              >
                <option value="Day">Ngày</option>
                <option value="Week">Tuần</option>
              </select>
            </div>
            <div className="w-1/4 flex justify-end">
              <TaskNotificationCenter tasks={events} />
            </div>
          </div>{" "}
          <Calendar
            events={events}
            startDate={startDate}
            setStartDate={setStartDate}
            viewType={viewType}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
