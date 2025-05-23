import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 600 },
  { name: "Group C", value: 500 },
];

const COLORS = ["#4E0916", "#F4964E", "#E91B41"];

export default function PerformancePieChart() {
  return (
    <div className="relative w-full h-[300px]">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            innerRadius={70}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
            cx="50%"
            cy="50%"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-[14px]">
        <p className="text-[#979595]">Total Tickets</p>
        <p className="text-black font-bold text-[18px]">1,500</p>
      </div>
    </div>
  );
}
