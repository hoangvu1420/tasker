import React, { useState, useEffect } from "react";
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from "@daypilot/daypilot-lite-react";
import { PRIORITY_COLORS } from "../constants/colors";
import TaskModal from "./TaskModal";
import "./Calendar.css"; // Import CSS file for calendar styling

const Calendar = ({
  events,
  startDate,
  // setStartDate,
  viewType,
  onAddTask,
  onUpdateTask,
  onDeleteTask
}) => {
  const [calendar, setCalendar] = React.useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Update calendar view type when it changes
  React.useEffect(() => {
    if (calendar) {
      calendar.update({ viewType: viewType });
    }
  }, [viewType, calendar]);

  // Highlight current date in calendar header
  useEffect(() => {
    if (calendar) {
      const highlightCurrentDate = () => {
        // Wait for the calendar to fully render
        setTimeout(() => {
          // Get the main calendar element
          const calendarMain = document.querySelector('.calendar_default_main');
          if (!calendarMain) return;

          // Get today's date in format MM/DD/YYYY
          const today = new Date();
          const formattedToday = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;

          // Find the date cells in the header
          const dateHeaderCells = calendarMain.querySelector('div:nth-child(1) > table > tbody > tr > td:nth-child(2) > table > tbody > tr > td');

          if (dateHeaderCells) {
            // Loop through all header cells
            const headerCells = Array.from(dateHeaderCells.parentElement.children);
            headerCells.forEach(cell => {
              // Find the inner div with the date text
              const dateDiv = cell.querySelector('.calendar_default_colheader_inner');
              if (dateDiv) {
                // Remove current-date class from all cells first
                dateDiv.classList.remove('calendar-current-date');

                // Apply class to current date
                if (dateDiv.textContent === formattedToday) {
                  dateDiv.classList.add('calendar-current-date');
                }
              }
            });
          }
        }, 100); // Small delay to ensure DOM is ready
      };

      // Call the highlight function
      highlightCurrentDate();

      // Set up observer to handle dynamic updates to the calendar
      const observer = new MutationObserver(highlightCurrentDate);
      const calendarElement = document.querySelector('.calendar_default_main');

      if (calendarElement) {
        observer.observe(calendarElement, {
          childList: true,
          subtree: true
        });
      }

      // Clean up observer on unmount
      return () => {
        observer.disconnect();
      };
    }
  }, [calendar, startDate, viewType]);

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
    viewType: viewType || "Week", // Use the provided viewType or default to Week
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
