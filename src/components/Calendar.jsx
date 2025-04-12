import React from "react";
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from "@daypilot/daypilot-lite-react";
import { PRIORITY_COLORS } from "../constants/colors";

const Calendar = ({
  events,
  startDate,
  setStartDate,
  onAddTask,
  onUpdateTask
}) => {
  const [calendar, setCalendar] = React.useState(null);

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
      const newEvent = {
        start: args.start,
        end: args.end,
        id: DayPilot.guid(),
        text: modal.result,
        backColor: PRIORITY_COLORS.MEDIUM.background,
        fontColor: PRIORITY_COLORS.MEDIUM.text,
        priority: "MEDIUM"
      };

      onAddTask(newEvent);
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
        const updatedEvent = {...event, text};
        onUpdateTask(updatedEvent);
      }
    }
  };

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
