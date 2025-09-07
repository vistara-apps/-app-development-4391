import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockChartData = [
  { time: '00:00', value: 5000 },
  { time: '04:00', value: 5200 },
  { time: '08:00', value: 4800 },
  { time: '12:00', value: 5400 },
  { time: '16:00', value: 5800 },
  { time: '20:00', value: 5034 },
  { time: '24:00', value: 5234 },
];

const PortfolioChart: React.FC = () => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={mockChartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="time" 
            stroke="rgba(255,255,255,0.5)"
            fontSize={12}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.5)"
            fontSize={12}
            tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(0,0,0,0.8)', 
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              color: 'white'
            }}
            formatter={(value) => [`$${value}`, 'Portfolio Value']}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="hsl(160, 80%, 40%)" 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, fill: 'hsl(160, 80%, 40%)' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PortfolioChart;