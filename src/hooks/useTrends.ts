import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { MemeTrend, ApiResponse } from '../types';

export interface UseTrendsReturn {
  trends: MemeTrend[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  topTrend: MemeTrend | null;
  emergingTrends: MemeTrend[];
  peakHypeTrends: MemeTrend[];
}

export function useTrends(): UseTrendsReturn {
  const [trends, setTrends] = useState<MemeTrend[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrends = async () => {
    setLoading(true);
    setError(null);

    try {
      const response: ApiResponse<MemeTrend[]> = await apiService.getTrendingMemeCoins();
      
      if (response.success && response.data) {
        setTrends(response.data);
      } else {
        setError(response.error || 'Failed to fetch trend data');
        setTrends([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setTrends([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, []);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(fetchTrends, 60000);
    return () => clearInterval(interval);
  }, []);

  // Derived data
  const topTrend = trends.length > 0 ? trends[0] : null;
  const emergingTrends = trends.filter(trend => trend.hypePrediction === 'Emerging');
  const peakHypeTrends = trends.filter(trend => trend.hypePrediction === 'Peak');

  return {
    trends,
    loading,
    error,
    refetch: fetchTrends,
    topTrend,
    emergingTrends,
    peakHypeTrends,
  };
}
