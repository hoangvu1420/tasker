import { useState, useEffect } from 'react'
import './App.css'
import { DayPilot } from "@daypilot/daypilot-lite-react";
import Calendar from "./components/Calendar";
import Pet from "./components/Pet";
import TaskNotificationCenter from './components/TaskNotification';

function App() {
  const [startDate, setStartDate] = useState(DayPilot.Date.today());
  const [events, setEvents] = useState([]);

  // Pet state
  const [petMood, setPetMood] = useState('happy');
  const [petMessage, setPetMessage] = useState('Hôm nay Gâu Gâu rất vui!');

  // Load events from local storage on initial render
  useEffect(() => {
    const savedEvents = localStorage.getItem('tasks');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
      setPetMood('happy');
      setPetMessage('Gâu Gâu đã tải lịch trình của bạn!');
    } else {
      // Initialize sample events for first time users
      const sampleEvents = [
        {
          id: 1,
          text: "Học React",
          start: "2025-04-14T09:00:00",
          end: "2025-04-14T11:00:00",
          priority: "LOW",
          description: "Học các khái niệm cơ bản về React"
        },
        {
          id: 2,
          text: "Họp nhóm",
          start: "2025-04-15T14:00:00",
          end: "2025-04-15T15:30:00",
          priority: "MEDIUM",
          description: "Thảo luận về tiến độ dự án"
        },
        {
          id: 3,
          text: "Deadline dự án",
          start: "2025-04-16T10:00:00",
          end: "2025-04-16T12:00:00",
          priority: "HIGH",
          description: "Nộp bản demo cho khách hàng"
        },
        {
          id: 4,
          text: "Lịch học hàng tuần",
          start: "2025-04-17T08:30:00",
          end: "2025-04-17T11:30:00",
          priority: "FIXED",
          description: "Lớp học lập trình nâng cao"
        }
      ];
      setEvents(sampleEvents);
      localStorage.setItem('tasks', JSON.stringify(sampleEvents));
    }
  }, []);

  // Update local storage whenever events change
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(events));
    }
  }, [events]);

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

  // Delete task
  const handleDeleteTask = (id) => {
    // Update events state
    setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
    // Update pet mood
    setPetMood('sad');
    setPetMessage('Bạn đã xóa một nhiệm vụ, Gâu Gâu hơi buồn...');
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
          <div className='flex flex-row justify-between items-center mb-4'>
            <h1 className="text-3xl font-bold underline mb-4">Quản lý thời gian</h1>
            <TaskNotificationCenter tasks={events} />
            </div>
          
          <Calendar
            events={events}
            startDate={startDate}
            setStartDate={setStartDate}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        </div>
      </div>
    </>
  )
}

export default App
