import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { apiService } from '../services/api';
import { PortfolioEntry, ApiResponse } from '../types';

export interface UsePortfolioReturn {
  portfolio: PortfolioEntry[];
  loading: boolean;
  error: string | null;
  totalValue: number;
  totalChange24h: number;
  totalChangePercent24h: number;
  refetch: () => Promise<void>;
}

export function usePortfolio(): UsePortfolioReturn {
  const { address, isConnected } = useAccount();
  const [portfolio, setPortfolio] = useState<PortfolioEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolio = async () => {
    if (!address || !isConnected) {
      setPortfolio([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response: ApiResponse<PortfolioEntry[]> = await apiService.getPortfolioData(address);
      
      if (response.success && response.data) {
        setPortfolio(response.data);
      } else {
        setError(response.error || 'Failed to fetch portfolio data');
        setPortfolio([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setPortfolio([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, [address, isConnected]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!isConnected || !address) return;

    const interval = setInterval(fetchPortfolio, 30000);
    return () => clearInterval(interval);
  }, [address, isConnected]);

  // Calculate totals
  const totalValue = portfolio.reduce((sum, entry) => sum + entry.value, 0);
  const totalChange24h = portfolio.reduce((sum, entry) => {
    const change = (entry.currentPrice - entry.purchasePrice) * entry.quantity;
    return sum + change;
  }, 0);
  const totalChangePercent24h = totalValue > 0 ? (totalChange24h / totalValue) * 100 : 0;

  return {
    portfolio,
    loading,
    error,
    totalValue,
    totalChange24h,
    totalChangePercent24h,
    refetch: fetchPortfolio,
  };
}
