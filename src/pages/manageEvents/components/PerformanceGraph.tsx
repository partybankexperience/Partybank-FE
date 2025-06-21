
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { day: 'Sun', ticketsSold: 5000, totalRevenue: 50000000 },
    { day: 'Mon', ticketsSold: 4000, totalRevenue: 40000000 },
    { day: 'Tue', ticketsSold: 6000, totalRevenue: 60000000 },
    { day: 'Wed', ticketsSold: 8000, totalRevenue: 80000000 },
    { day: 'Thu', ticketsSold: 10000, totalRevenue: 100000000 },
    { day: 'Fri', ticketsSold: 12000, totalRevenue: 120000000 },
    { day: 'Sat', ticketsSold: 11000, totalRevenue: 110000000 },

  ];
  

export default function PerformanceChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 0 }}>
        
        {/* Gradient for area fill */}
        <defs>
          <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E91B41" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#E91B41" stopOpacity={0} />
          </linearGradient>
        </defs>

        <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#555" }}/>
        <YAxis 
          domain={[0, 14000000]} 
          tickFormatter={(value) => value.toLocaleString()}
          tick={{ fontSize: 10, fill: "#555" }}
        />
        <Tooltip 
  formatter={(value: number, name: string, props) => {
    const { payload } = props;
    console.log(value, name);
    return (
        <div className="p-2 rounded bg-white text-black text-sm">
          <div className="font-bold text-center">{payload.ticketsSold.toLocaleString()} tickets</div>
          <div className="text-center">${payload.totalRevenue.toLocaleString()}</div>
        </div>
      );
  }}
/>
        <Area
          type="monotone"
          dataKey="totalRevenue"
          stroke="#E91B41"
          fill="url(#areaColor)"
          strokeWidth={3}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
