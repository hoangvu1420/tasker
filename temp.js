import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, Star, CheckCircle, Circle, BarChart3, Target, TrendingUp, Edit2, Trash2 } from 'lucide-react';

const TaskManager = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      text: 'Học 100 từ vựng tiếng Anh',
      start: timeRange.start,
      end: timeRange.end,
      priority: 'MEDIUM',
      description: '',
      status: "todo"
    },
    {
      id: 2,
      text: 'Luyện tập viết code React',
      start: '08:00',
      end: '10:00',
      priority: 'HIGH',
      description: 'Tập trung vào các hooks và lifecycle methods',
      status: "doing"
    },
    {
      id: 3,
      text: 'Đọc sách về quản lý thời gian',
      start: '14:00',
      end: '15:30',
      priority: 'LOW',
      description: 'Đọc chương về kỹ thuật Pomodoro',
      status: "planned"
    }
  ]);

  const [newTask, setNewTask] = useState({
    title: '',
    category: '',
    priority: 'medium',
    estimatedTime: 60,
    dueDate: '',
    notes: ''
  });

  const [activeTab, setActiveTab] = useState('today');
  const [showAddForm, setShowAddForm] = useState(false);

  const priorities = {
    high: { label: 'Cao', color: 'text-red-600 bg-red-100', icon: '🔴' },
    medium: { label: 'Trung bình', color: 'text-yellow-600 bg-yellow-100', icon: '🟡' },
    low: { label: 'Thấp', color: 'text-green-600 bg-green-100', icon: '🟢' }
  };

  const toggleTaskStatus = (id) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const newStatus = task.status === 'done' ? 'doing' :
                         task.status === 'doing' ? 'done' : 'doing';
        const newProgress = newStatus === 'done' ? 100 : task.progress;
        const newPhase = newStatus === 'done' ? 'Check' : 'Do';

        return {
          ...task,
          status: newStatus,
          progress: newProgress,
          pdcaPhase: newPhase
        };
      }
      return task;
    }));
  };

  const updateProgress = (id, progress) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        return {
          ...task,
          progress: parseInt(progress),
          status: progress >= 100 ? 'done' : 'doing',
          pdcaPhase: progress >= 100 ? 'Check' : 'Do'
        };
      }
      return task;
    }));
  };

  const tasksByDate = getTasksByDate();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            📋 Quản Lý Công Việc PDCA
          </h1>
          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            {[
              { key: 'today', label: '📅 Hôm nay', count: tasksByDate.today.length },
              { key: 'tomorrow', label: '⏰ Ngày mai', count: tasksByDate.tomorrow.length },
              { key: 'done', label: '✅ Đã hoàn thành', count: tasksByDate.done.length },
              { key: 'all', label: '📊 Tất cả', count: tasksByDate.all.length }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {tasksByDate[activeTab].length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center text-gray-500">
              <Target size={48} className="mx-auto mb-4 text-gray-300" />
              <p>Không có công việc nào trong mục này</p>
            </div>
          ) : (
            tasksByDate[activeTab].map(task => (
              <TaskCard key={task.id} task={task} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskManager;
