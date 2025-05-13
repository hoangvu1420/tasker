import React, { useState } from "react";
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from "@daypilot/daypilot-lite-react";
import { PRIORITY_COLORS } from "../constants/colors";
import TaskModal from "./TaskModal";
import "./Calendar.css"; // Import CSS file for calendar styling

const Calendar = ({
  events,
  startDate,
  setStartDate,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  viewType,
  setViewType
}) => {
  const [calendar, setCalendar] = React.useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Function to open modal for new task
  const openNewTaskModal = (args) => {
    // Create a properly structured timeRange object from the args
    const timeRange = {
      start: args.start.toString(),
      end: args.end.toString()
    };

    // Create an empty task with the time range for the modal
    const newEmptyTask = {
      id: null,
      text: '',
      start: timeRange.start,
      end: timeRange.end,
      priority: 'MEDIUM',
      description: ''
    };

    setSelectedTask(newEmptyTask);
    setShowModal(true);
  };

  // Function to open modal for editing task
  const openEditTaskModal = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  // Function to close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedTask(null);
  };

  // Function to handle saving task
  const handleSaveTask = (taskData) => {
    if (taskData.id) {
      // Update existing task
      onUpdateTask(taskData);
    } else {
      // Create new task with proper ID
      const newTask = {
        ...taskData,
        id: DayPilot.guid()
      };
      onAddTask(newTask);
    }
  };

  // Calendar configuration
  const config = {
    viewType: viewType,
    durationBarVisible: false,
    timeRangeSelectedHandling: "Enabled",
    onTimeRangeSelected: args => {
      calendar?.clearSelection();
      openNewTaskModal(args);
    },
    // Customize event rendering to show priority indicators with improved styling
    onBeforeEventRender: args => {
      // Add an indicator based on priority
      const priority = args.data.priority || "MEDIUM";

      // Apply color scheme based on priority
      args.data.backColor = PRIORITY_COLORS[priority].background;
      args.data.fontColor = PRIORITY_COLORS[priority].text;

      // Add a border to make events more visible
      args.data.borderColor = "darker";

      // Add rounded corners
      args.data.cssClass = "rounded-md shadow-md transition-transform transform hover:scale-105 opacity-80";
    },
    onEventClick: args => {
      const event = args.e.data;
      openEditTaskModal(event);
    }
  };

  return (
    <div className="flex gap-4">
      {/* Date Picker (Navigator) */}
      {/* <div className="w-56">
        <DayPilotNavigator
          selectMode="Week"
          showMonths={2}
          skipMonths={2}
          selectionDay={startDate}
          onTimeRangeSelected={(args) => setStartDate(args.day)}
        />
      </div> */}

      {/* Calendar */}
      <div className="flex-grow">
        <DayPilotCalendar
          {...config}
          startDate={startDate}
          events={events}
          controlRef={setCalendar}
        />
      </div>

      {/* Custom Task Modal */}
      <TaskModal
        isOpen={showModal}
        onClose={closeModal}
        task={selectedTask}
        onSave={handleSaveTask}
        onDelete={onDeleteTask}
      />
    </div>
  );
};

export default Calendar;
