import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { apiService } from '../services/api';
import { ChartDataPoint } from '../types';
import LoadingSpinner from './ui/LoadingSpinner';

interface PortfolioChartProps {
  symbol?: string;
  timeframe?: '1h' | '24h' | '7d' | '30d';
}

const PortfolioChart: React.FC<PortfolioChartProps> = ({ 
  symbol = 'PEPE', 
  timeframe = '24h' 
}) => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiService.getChartData(symbol, timeframe);
        
        if (response.success && response.data) {
          // Transform data for chart
          const transformedData = response.data.map((point, index) => ({
            time: formatTime(point.timestamp, timeframe, index),
            value: point.value,
            volume: point.volume,
          }));
          setChartData(transformedData);
        } else {
          setError(response.error || 'Failed to fetch chart data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [symbol, timeframe]);

  const formatTime = (timestamp: string, timeframe: string, index: number) => {
    const date = new Date(timestamp);
    
    switch (timeframe) {
      case '1h':
        return date.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        });
      case '24h':
        return date.toLocaleTimeString('en-US', { 
          hour: '2-digit',
          hour12: false 
        });
      case '7d':
        return date.toLocaleDateString('en-US', { 
          weekday: 'short' 
        });
      case '30d':
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
      default:
        return date.toLocaleTimeString('en-US', { 
          hour: '2-digit',
          hour12: false 
        });
    }
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-center space-y-2">
          <LoadingSpinner />
          <p className="text-sm text-gray-400">Loading chart data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-64 flex items-center justify-center">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="time" 
            stroke="rgba(255,255,255,0.5)"
            fontSize={12}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.5)"
            fontSize={12}
            tickFormatter={(value) => `$${value.toFixed(6)}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(0,0,0,0.8)', 
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              color: 'white'
            }}
            formatter={(value: number) => [`$${value.toFixed(6)}`, 'Price']}
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
