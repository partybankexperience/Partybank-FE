
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { month: 'JAN', ticketsSold: 5000, totalRevenue: 50000000 },
    { month: 'FEB', ticketsSold: 4000, totalRevenue: 40000000 },
    { month: 'MAR', ticketsSold: 6000, totalRevenue: 60000000 },
    { month: 'APR', ticketsSold: 8000, totalRevenue: 80000000 },
    { month: 'MAY', ticketsSold: 10000, totalRevenue: 100000000 },
    { month: 'JUN', ticketsSold: 12000, totalRevenue: 120000000 },
    { month: 'JUL', ticketsSold: 11000, totalRevenue: 110000000 },
    { month: 'AUG', ticketsSold: 9000, totalRevenue: 90000000 },
    { month: 'SEP', ticketsSold: 70000, totalRevenue: 70000000 },
    { month: 'OCT', ticketsSold: 6000, totalRevenue: 60000000 },
    { month: 'NOV', ticketsSold: 4000, totalRevenue: 40000000 },
    { month: 'DEC', ticketsSold: 3000, totalRevenue: 30000000 },
  ];
  

export default function SimpleAreaChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 20, right: 30, left: 50, bottom: 0 }}>
        
        {/* Gradient for area fill */}
        <defs>
          <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E91B41" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#E91B41" stopOpacity={0} />
          </linearGradient>
        </defs>

        <XAxis dataKey="month" />
        <YAxis 
          domain={[0, 14000000]} 
          tickFormatter={(value) => value.toLocaleString()}
        />
        <Tooltip 
  formatter={(value: number, name: string, props) => {
    const { payload } = props;
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
