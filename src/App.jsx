import { useState, useEffect } from 'react'
import './App.css'
import { DayPilot } from "@daypilot/daypilot-lite-react";
import Calendar from "./components/Calendar";
import Pet from "./components/Pet";

function App() {
  const [startDate, setStartDate] = useState(DayPilot.Date.today());
  const [events, setEvents] = useState([]);

  // Pet state
  const [petMood, setPetMood] = useState('happy');
  const [petMessage, setPetMessage] = useState('Hôm nay Gâu Gâu rất vui!');

  // Initialize sample events
  useEffect(() => {
    const sampleEvents = [
      {
        id: 1,
        text: "Học React",
        start: "2025-04-14T09:00:00",
        end: "2025-04-14T11:00:00",
        priority: "LOW",
      },
      {
        id: 2,
        text: "Họp nhóm",
        start: "2025-04-15T14:00:00",
        end: "2025-04-15T15:30:00",
        priority: "MEDIUM",
      },
      {
        id: 3,
        text: "Deadline dự án",
        start: "2025-04-16T10:00:00",
        end: "2025-04-16T12:00:00",
        priority: "HIGH",
      },
      {
        id: 4,
        text: "Lịch học hàng tuần",
        start: "2025-04-17T08:30:00",
        end: "2025-04-17T11:30:00",
        priority: "FIXED",
      }
    ];
    setEvents(sampleEvents);
  }, []);

  // Add a new task
  const handleAddTask = (newEvent) => {
    // Update events state
    setEvents(prevEvents => [...prevEvents, newEvent]);
    // Update pet mood
    setPetMood('happy');
    setPetMessage('Bạn đã lập kế hoạch mới, tuyệt vời lắm!');
  };

  // Update existing task
  const handleUpdateTask = (updatedEvent) => {
    // Update events state
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
    // Update pet mood
    setPetMood('happy');
    setPetMessage('Bạn đang cập nhật kế hoạch, tốt lắm!');
  };

  return (
    <>
      <div className="flex min-h-screen p-8 gap-8 bg-gray-100">
        {/* Bên trái: Thú cưng */}
        <Pet
          name="Gâu Gâu"
          message={petMessage}
          mood={petMood}
        />

        {/* Bên phải: DatePicker + Calendar */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold underline mb-4">Quản lý thời gian</h1>
          <Calendar
            events={events}
            startDate={startDate}
            setStartDate={setStartDate}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
          />
        </div>
      </div>
    </>
  )
}

export default App
