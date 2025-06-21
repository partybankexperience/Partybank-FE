import { useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from "recharts";

const hours = [
  "12AM", "2AM", "4AM", "6AM", "8AM", "10AM",
  "12PM", "2PM", "4PM", "6PM", "8PM", "9PM"
];

const dummyData = hours.map((time) => ({
  time,
  value: Math.floor(Math.random() * 100) // Random dummy values
}));

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const TimeBarChart = () => {
  const [selectedDay, setSelectedDay] = useState("Mon");

  return (
    <div className="max-w-[90vw] lg:max-w-[20vw] mx-auto mt-[25px]">
      {/* Days Selector */}
      <div className="flex justify-between gap-[15px] items-center mb-4 px-1 overflow-x-auto">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              selectedDay === day ? "bg-[#fce4e8] text-primary" : "bg-gray-100 text-gray-700"
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Bar Chart */}
      <div className=" h-[150px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dummyData}>
            <XAxis dataKey="time" tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" fill="#E91B41" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TimeBarChart;
