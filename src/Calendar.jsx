import React, { useState, useEffect } from "react";
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from "@daypilot/daypilot-lite-react";

// Task priority colors with improved contrast
const PRIORITY_COLORS = {
  HIGH: {
    background: "#cc4125", // Red for high priority
    text: "#ffffff" // White text for contrast
  },
  MEDIUM: {
    background: "#f1c232", // Yellow for medium priority
    text: "#000000" // Black text for contrast
  },
  LOW: {
    background: "#6aa84f", // Green for low priority
    text: "#ffffff" // White text for contrast
  },
  FIXED: {
    background: "#3d85c6", // Blue for fixed events
    text: "#ffffff" // White text for contrast
  }
};

const Calendar = () => {
  const [startDate, setStartDate] = useState(DayPilot.Date.today());
  const [calendar, setCalendar] = useState(null);
  const [events, setEvents] = useState([]);

  // Calendar configuration
  const config = {
    viewType: "Week",
    durationBarVisible: false,
    timeRangeSelectedHandling: "Enabled",
    onTimeRangeSelected: async args => {
      const modal = await DayPilot.Modal.prompt("Tạo nhiệm vụ mới:", "Nhiệm vụ");
      calendar?.clearSelection();
      if (!modal.result) { return; }

      // Create a new event with medium priority by default
      calendar?.events.add({
        start: args.start,
        end: args.end,
        id: DayPilot.guid(),
        text: modal.result,
        backColor: PRIORITY_COLORS.MEDIUM.background,
        fontColor: PRIORITY_COLORS.MEDIUM.text,
        priority: "MEDIUM"
      });
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
    onEventClick: async args => {
      const event = args.e.data;
      const text = await DayPilot.Modal.prompt("Chỉnh sửa nhiệm vụ:", event.text);
      if (text) {
        event.text = text;
        calendar?.events.update(event);
      }
    }
  };

  // Initialize sample events
  useEffect(() => {
    const sampleEvents = [
      {
        id: 1,
        text: "Học React",
        start: "2025-04-14T09:00:00",
        end: "2025-04-14T11:00:00",
        backColor: PRIORITY_COLORS.LOW.background,
        fontColor: PRIORITY_COLORS.LOW.text,
        priority: "LOW",
      },
      {
        id: 2,
        text: "Họp nhóm",
        start: "2025-04-15T14:00:00",
        end: "2025-04-15T15:30:00",
        backColor: PRIORITY_COLORS.MEDIUM.background,
        fontColor: PRIORITY_COLORS.MEDIUM.text,
        priority: "MEDIUM",
      },
      {
        id: 3,
        text: "Deadline dự án",
        start: "2025-04-16T10:00:00",
        end: "2025-04-16T12:00:00",
        backColor: PRIORITY_COLORS.HIGH.background,
        fontColor: PRIORITY_COLORS.HIGH.text,
        priority: "HIGH",
      },
      {
        id: 4,
        text: "Lịch học hàng tuần",
        start: "2025-04-17T08:30:00",
        end: "2025-04-17T11:30:00",
        backColor: PRIORITY_COLORS.FIXED.background,
        fontColor: PRIORITY_COLORS.FIXED.text,
        priority: "FIXED",
      }
    ];
    setEvents(sampleEvents);
  }, []);

  return (
    <div className="flex gap-4">
      {/* Date Picker (Navigator) */}
      <div className="w-56">
        <DayPilotNavigator
          selectMode="Week"
          showMonths={2}
          skipMonths={2}
          selectionDay={startDate}
          onTimeRangeSelected={(args) => setStartDate(args.day)}
        />
      </div>

      {/* Calendar */}
      <div className="flex-grow">
        <DayPilotCalendar
          {...config}
          startDate={startDate}
          events={events}
          controlRef={setCalendar}
        />
      </div>
    </div>
  );
};

export default Calendar;
