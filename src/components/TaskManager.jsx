import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, Star, CheckCircle, Circle, BarChart3, Target, TrendingUp, Edit2, Trash2, X, AlertTriangle } from 'lucide-react';

const TaskManager = ({ tasks: initialTasks, onClose, onTaskStatusChange, updateScore, compact = false }) => {
  const [tasks, setTasks] = useState(initialTasks);

  const [activeTab, setActiveTab] = useState('today');

  const priorities = {
    HIGH: { label: 'Cao', color: 'text-red-600 bg-red-100', icon: '🔴 Cao', points: 3 },
    MEDIUM: { label: 'Trung bình', color: 'text-yellow-600 bg-yellow-100', icon: '🟡 Trung bình', points: 2 },
    LOW: { label: 'Thấp', color: 'text-green-600 bg-green-100', icon: '🟢 Thấp', points: 1 }
  };

  // Ensure tasks state is updated if initialTasks prop changes
  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const toggleTaskStatus = (id) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === id) {
        const newStatus = task.status === 'done' ? 'todo' : 'done'; // Toggle between todo and done
        const newProgress = newStatus === 'done' ? 100 : 0; // Set progress based on status

        return {
          ...task,
          status: newStatus,
          progress: newProgress,
        };
      }
      return task;
    });
    setTasks(updatedTasks);
    // Call the prop function to update status in parent and recalculate score
    if (onTaskStatusChange) {
      const taskToUpdate = updatedTasks.find(task => task.id === id);
      onTaskStatusChange(id, taskToUpdate.status === 'done'); // Pass true if done, false if not
    }
    if (updateScore) {
      updateScore(updatedTasks); // Inform Pet.jsx to update the score
    }
  };

  const updateProgress = (id, progress) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === id) {
        return {
          ...task,
          progress: parseInt(progress),
          status: progress >= 100 ? 'done' : 'doing',
        };
      }
      return task;
    });
    setTasks(updatedTasks);
    // No score update here as score only changes on completion (status 'done')
  };

  const getDateFromTimeString = (timeString) => {
    try {
      const date = new Date(timeString);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    } catch (error) {
      console.error("Invalid date format:", timeString);
      return "";
    }
  };

  const getTimeFromTimeString = (timeString) => {
    try {
      const date = new Date(timeString);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    } catch (error) {
      console.error("Invalid date format:", timeString);
      return "";
    }
  };

  const getTasksByDate = () => {
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
      return taskDate === formattedToday && task.status !== 'done';
    });

    const tomorrowTasks = tasks.filter((task) => {
      if (!task.start) return false;
      const taskDate = getDateFromTimeString(task.start);
      return taskDate === formattedTomorrow && task.status !== 'done';
    });

    // Overdue tasks: before today and not done
    const overdueTasks = tasks.filter((task) => {
      if (!task.start || task.status === 'done') return false;
      const taskDate = getDateFromTimeString(task.start);
      return taskDate < formattedToday;
    });

    const doneTasks = tasks.filter(task => task.status === 'done');

    return {
      today: todayTasks,
      tomorrow: tomorrowTasks,
      overdue: overdueTasks,
      done: doneTasks,
      all: tasks,
    };
  };

  const tasksByDate = getTasksByDate();

  const TaskCard = ({ task, showOverdueWarning = false }) => (
    <div className={`bg-white rounded-lg shadow-sm p-4 border ${showOverdueWarning ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center flex-1">
          <button
            onClick={() => toggleTaskStatus(task.id)}
            className="p-1 rounded-full text-gray-400 hover:text-blue-500 transition-colors mr-2"
          >
            {task.status === 'done' ? (
              <CheckCircle size={24} className="text-green-500" />
            ) : (
              <Circle size={24} />
            )}
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-800 break-words">
                {task.text}
              </h3>
            </div>
            {task.description && (
              <p className="text-sm text-gray-500">{task.description}</p>
            )}
            {showOverdueWarning && (
              <p className="text-xs text-red-600 font-medium mt-1">⚠️ Quá hạn</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {task.priority && priorities[task.priority] && (
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${priorities[task.priority].color}`}
            >
              {priorities[task.priority].label}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center text-sm text-gray-500 mb-3 gap-4">
        {task.start && (
          <span className="flex items-center">
            <Calendar size={16} className="mr-1" />
            {getTimeFromTimeString(task.start)}
          </span>
        )}
        {task.end && (
          <span className="flex items-center">
            <Clock size={16} className="mr-1" />
            {getTimeFromTimeString(task.end)}
          </span>
        )}
      </div>

      {task.progress !== undefined && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Tiến độ: {task.progress}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={task.progress}
            onChange={(e) => updateProgress(task.id, e.target.value)}
            className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none"
          />
        </div>
      )}
    </div>
  );

  if (compact) {
    return (
      <div className="w-full h-full flex flex-col">
        {/* Compact Header */}
        <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">📋 Công việc</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
          >
            <X size={16} />
          </button>
        </div>

        {/* Compact Tabs */}
        <div className="flex gap-1 mb-3 flex-wrap">
          {[
            { key: 'today', label: 'Hôm nay', count: tasksByDate.today.length },
            { key: 'tomorrow', label: 'Ngày mai', count: tasksByDate.tomorrow.length },
            { key: 'overdue', label: 'Quá hạn', count: tasksByDate.overdue.length, alert: tasksByDate.overdue.length > 0 },
            { key: 'done', label: 'Hoàn thành', count: tasksByDate.done.length }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                activeTab === tab.key
                  ? (tab.alert ? 'bg-red-500 text-white' : 'bg-blue-500 text-white')
                  : tab.alert
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label} ({tab.count})
              {tab.alert && tab.count > 0 && ' ⚠️'}
            </button>
          ))}
        </div>

        {/* Compact Tasks List */}
        <div className="flex-1 overflow-y-auto">
          {tasksByDate[activeTab].length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <Target size={32} className="mx-auto mb-2 text-gray-300" />
              <p className="text-sm">
                {activeTab === 'overdue' ? 'Không có công việc quá hạn' : 'Không có công việc nào'}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {tasksByDate[activeTab].map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  compactMode={true}
                  showOverdueWarning={activeTab === 'overdue'}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Full screen version (original)
  return (
    <div className="fixed inset-0 bg-gray-50 p-6 z-40 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              📋 Danh sách công việc
            </h1>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {[
              { key: 'today', label: '📅 Hôm nay', count: tasksByDate.today.length },
              { key: 'tomorrow', label: '⏰ Ngày mai', count: tasksByDate.tomorrow.length },
              { key: 'overdue', label: '⚠️ Quá hạn', count: tasksByDate.overdue.length, alert: tasksByDate.overdue.length > 0 },
              { key: 'done', label: '✅ Đã hoàn thành', count: tasksByDate.done.length },
              { key: 'all', label: '📊 Tất cả', count: tasksByDate.all.length }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.key
                    ? (tab.alert ? 'bg-red-500 text-white' : 'bg-blue-500 text-white')
                    : tab.alert
                      ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Overdue Alert */}
          {tasksByDate.overdue.length > 0 && activeTab !== 'overdue' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle size={20} className="text-red-500" />
                <span className="text-red-700 font-medium">
                  Bạn có {tasksByDate.overdue.length} công việc quá hạn!
                </span>
                <button
                  onClick={() => setActiveTab('overdue')}
                  className="ml-auto px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm font-medium"
                >
                  Xem ngay
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {tasksByDate[activeTab].length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center text-gray-500">
              <Target size={48} className="mx-auto mb-4 text-gray-300" />
              <p>
                {activeTab === 'overdue'
                  ? 'Tuyệt vời! Không có công việc quá hạn nào.'
                  : 'Không có công việc nào trong mục này'
                }
              </p>
            </div>
          ) : (
            tasksByDate[activeTab].map(task => (
              <TaskCard
                key={task.id}
                task={task}
                showOverdueWarning={activeTab === 'overdue'}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskManager;
