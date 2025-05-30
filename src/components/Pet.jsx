import React, { useState, useRef, useEffect } from "react";
import TaskManager from "./TaskManager"; // Assuming TaskManager.jsx is in the same directory

const Pet = ({
  name,
  message,
  mood = "happy",
  tasks = [],
  onTaskStatusChange,
}) => {
  const [isOpen, setIsOpen] = useState(false); // This state will now control the task list within the pet view itself, if needed
  const [score, setScore] = useState(0);
  const statuses = [
    "Đang ăn",
    "Đang ngủ",
    "Đang chơi",
    "Đang học",
    "Đang nghỉ",
  ];

  const [checkedStatuses, setCheckedStatuses] = useState(
    Array(statuses.length).fill(false)
  );

  const [checkedTasks, setCheckedTasks] = useState({});

  const [currentMood, setCurrentMood] = useState(mood);
  const [showTaskManager, setShowTaskManager] = useState(false); // New state to control TaskManager visibility

  const containerRef = useRef(null);

  useEffect(() => {
    setCurrentMood(mood);
  }, [mood]);

  useEffect(() => {
    if (tasks.length > 0) {
      const initialCheckedState = {};
      tasks.forEach((task) => {
        initialCheckedState[task.id] = task.status === "done";
      });
      setCheckedTasks(initialCheckedState);

      const completedTasks = tasks.filter(
        (task) => task.status === "done"
      ).length;
      const checkedStatusCount = checkedStatuses.filter(Boolean).length;
      setScore(completedTasks + checkedStatusCount);
    }
  }, [tasks]);

  useEffect(() => {
    if (currentMood !== "normal") {
      const timer = setTimeout(() => {
        setCurrentMood("normal");
      }, 15000);

      return () => clearTimeout(timer);
    }
  }, [currentMood]);

  const moodsByIndex = ["happy", "sad", "angry", "sleeping", "normal"];

  const handleCheckboxChange = (index) => {
    setCheckedStatuses((prev) => {
      const newChecked = [...prev];
      newChecked[index] = !newChecked[index];

      const statusScore = newChecked.filter(Boolean).length;
      const taskScore = Object.values(checkedTasks).filter(Boolean).length;
      setScore(statusScore + taskScore);

      const checkedIndex = newChecked.findIndex(Boolean);
      if (checkedIndex !== -1) {
        setCurrentMood(moodsByIndex[checkedIndex]);
      } else {
        setCurrentMood("normal");
      }

      return newChecked;
    });
  };

  const handleTaskCheckboxChange = (taskId) => {
    setCheckedTasks((prev) => {
      const newCheckedTasks = {
        ...prev,
        [taskId]: !prev[taskId],
      };

      const taskScore = Object.values(newCheckedTasks).filter(Boolean).length;
      const statusScore = checkedStatuses.filter(Boolean).length;
      setScore(statusScore + taskScore);

      if (
        Object.values(newCheckedTasks).filter(Boolean).length >
        Object.values(prev).filter(Boolean).length
      ) {
        setCurrentMood("happy");
      } else if (
        Object.values(newCheckedTasks).filter(Boolean).length <
        Object.values(prev).filter(Boolean).length
      ) {
        setCurrentMood("sad");
      }

      return newCheckedTasks;
    });

    if (onTaskStatusChange) {
      onTaskStatusChange(taskId, !checkedTasks[taskId]);
    }
  };

  const getPetImage = () => {
    switch (currentMood) {
      case "happy":
        return "/pet_happy.gif";
      case "sad":
        return "/pet_sad.gif";
      case "angry":
        return "/pet_angry.gif";
      case "sleeping":
        return "/pet_sleeping.gif";
      case "normal":
      default:
        return "/pet_normal.png";
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const getDateFromTimeString = (timeString) => {
    try {
      const date = new Date(timeString);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(date.getDate()).padStart(2, "0")}`;
    } catch (error) {
      console.error("Invalid date format:", timeString);
      return "";
    }
  };

  const today = new Date();
  const formattedToday = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const formattedTomorrow = `${tomorrow.getFullYear()}-${String(
    tomorrow.getMonth() + 1
  ).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;

  const todayTasks = tasks.filter((task) => {
    if (!task.start) return false;
    const taskDate = getDateFromTimeString(task.start);
    return taskDate === formattedToday;
  });

  const upcomingTasks = tasks.filter((task) => {
    if (!task.start) return false;
    const taskDate = getDateFromTimeString(task.start);
    return taskDate === formattedTomorrow;
  });

  // Function to update score when a task is checked/unchecked in TaskManager
  const updateScoreBasedOnTaskCompletion = (updatedTasks) => {
    let newScore = 0;
    const priorityPoints = {
      HIGH: 3,
      MEDIUM: 2,
      LOW: 1,
    };

    updatedTasks.forEach((task) => {
      if (task.status === "done") {
        newScore += priorityPoints[task.priority] || 0;
      }
    });
    // Add points from daily activities
    newScore += checkedStatuses.filter(Boolean).length;
    setScore(newScore);
  };

  if (showTaskManager) {
    return (
      <div className="flex flex-col items-center">
        <div className="w-64 flex flex-col items-center rounded-lg shadow p-4 flex-grow w-[350px] bg-white relative">
          <TaskManager
            tasks={tasks}
            onClose={() => setShowTaskManager(false)}
            onTaskStatusChange={onTaskStatusChange} // Pass the original onTaskStatusChange
            updateScore={updateScoreBasedOnTaskCompletion} // Pass the function to update score
            compact={true} // Add a compact prop to tell TaskManager to render in compact mode
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-64 flex flex-col items-center rounded-lg shadow p-4 flex-grow w-[350px] bg-white relative">
        <div className="w-full h-[450px] border-t border-gray-300 my-4 bg-[url('/pet_name_sign.png')] bg-no-repeat bg-center bg-cover flex justify-center items-center">
          <span className="text-gray-700 text-2xl font-bold">
            Thú cưng của tôi
          </span>
        </div>

        <div className="flex-grow"></div>

        <div className="w-full text-right mb-2 flex justify-end items-center gap-2">
          <img src="/coin_ic.png" alt="coin icon" className="w-5 h-5" />
          <span className="font-semibold text-gray-700">Điểm: {score}</span>
        </div>

        <div className="flex flex-col items-center py-16 border-t border-b border-gray-300 w-full max-w-[500px] mx-auto bg-ghostwhite">
          <div className="relative mb-4 w-full max-w-[250px]">
            <div className="bg-white p-3 rounded-lg shadow-md relative">
              <p className="text-gray-700 text-center break-words">{message}</p>
              <div className="absolute h-4 w-4 bg-white rotate-45 -bottom-2 left-1/2 -translate-x-1/2"></div>
            </div>
          </div>

          <img
            src={getPetImage()}
            alt={`${name} is ${currentMood}`}
            className="w-40 h-40 object-cover mb-4"
          />
          <h2 className="text-xl font-semibold mb-2">{name}</h2>
          <p className="text-gray-500 text-center">
            Trạng thái:{" "}
            {currentMood === "happy"
              ? "Vui vẻ 😄"
              : currentMood === "sad"
              ? "Buồn 😢"
              : currentMood === "angry"
              ? "Giận 😠"
              : currentMood === "sleeping"
              ? "Ngủ 😴"
              : "Bình thường 🙂"}
          </p>
        </div>

        <div className="flex-grow"></div>

        <div className="w-full relative mt-4" ref={containerRef}>
          <button
            onClick={() => setShowTaskManager(true)} // This button now shows the TaskManager
            className="w-full flex justify-between items-center p-2 border border-gray-300 rounded-md bg-white cursor-pointer select-none z-20 relative"
          >
            <span className="font-semibold text-gray-700">
              Danh sách công việc
            </span>
            <svg
              className={`w-5 h-5 text-gray-600 transform transition-transform duration-300 ${
                isOpen ? "rotate-0" : "rotate-180"
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pet;
