import { useState } from "react";
import "./App.css";
import { DayPilot } from "@daypilot/daypilot-lite-react";
import Calendar from "./components/Calendar";
import Pet from "./components/Pet";
import TaskNotificationCenter from "./components/TaskNotification";
import { ToastContainer } from "react-toastify";
import { usePet } from "./hooks/usePet";
import { useTasks } from "./hooks/useTasks";

function App() {
  const [startDate, setStartDate] = useState(DayPilot.Date.today());
  const [viewType, setViewType] = useState("Week");

  const { petMood, petMessage, updatePetState } = usePet();
  const { events, addTask, updateTask, deleteTask, changeStatus } = useTasks(updatePetState);

  return (
    <>
      <div className="flex min-h-screen p-8 gap-8 bg-gray-100">
        <Pet
          name="Mèo béo"
          message={petMessage}
          mood={petMood}
          tasks={events}
          onTaskStatusChange={changeStatus}
        />

        <div className="flex-1">
          <div className="flex flex-row items-center justify-between mb-4">
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
              <TaskNotificationCenter
                task={events}
                petMood={petMood}
                petName="Mèo béo"
              />
            </div>
          </div>
          <Calendar
            events={events}
            startDate={startDate}
            setStartDate={setStartDate}
            viewType={viewType}
            onAddTask={addTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
          />
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
