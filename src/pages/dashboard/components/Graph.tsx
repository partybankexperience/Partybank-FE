
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface MonthData {
  month: string;
  ticketsSold: number;
  totalRevenue: number;
}

const data: MonthData[] = [
    // { month: 'JAN', ticketsSold: 5000, totalRevenue: 50000000 },
    // { month: 'FEB', ticketsSold: 4000, totalRevenue: 40000000 },
    // { month: 'MAR', ticketsSold: 6000, totalRevenue: 60000000 },
    // { month: 'APR', ticketsSold: 8000, totalRevenue: 80000000 },
    // { month: 'MAY', ticketsSold: 10000, totalRevenue: 100000000 },
    // { month: 'JUN', ticketsSold: 12000, totalRevenue: 120000000 },
    // { month: 'JUL', ticketsSold: 11000, totalRevenue: 110000000 },
    // { month: 'AUG', ticketsSold: 9000, totalRevenue: 90000000 },
    // { month: 'SEP', ticketsSold: 70000, totalRevenue: 70000000 },
    // { month: 'OCT', ticketsSold: 6000, totalRevenue: 60000000 },
    // { month: 'NOV', ticketsSold: 4000, totalRevenue: 40000000 },
    // { month: 'DEC', ticketsSold: 3000, totalRevenue: 30000000 },
  ];
  


  export default function SimpleAreaChart() {
    // Conditional: no data
    const hasData = Array.isArray(data) && data.length > 0;
  
    return (
      <ResponsiveContainer width="100%" height={300}>
        {hasData ? (
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E91B41" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#E91B41" stopOpacity={0} />
              </linearGradient>
            </defs>
  
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#555' }} />
            <YAxis
              domain={[0, 'dataMax']}
              tickFormatter={(value) => value.toLocaleString()}
              tick={{ fontSize: 10, fill: '#555' }}
            />
            <Tooltip
              contentStyle={{ borderRadius: 4 }}
              formatter={(value, name, props) => {
                const payload = props.payload as any;
                return [
                  `${payload.ticketsSold.toLocaleString()} tickets`,
                  `$${payload.totalRevenue.toLocaleString()}`,
                ];
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
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <h3 className="text-lg font-medium text-gray-800">No Sales Yet</h3>
            <p className="text-sm text-gray-500 mt-2">
              Your sales revenue graph will appear here once you start making sales.
            </p>
          </div>
        )}
      </ResponsiveContainer>
    );
  }
