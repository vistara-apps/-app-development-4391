import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react';
import PortfolioChart from './PortfolioChart';
import LoadingSpinner from './ui/LoadingSpinner';
import ErrorMessage from './ui/ErrorMessage';
import { usePaymentContext } from '../hooks/usePaymentContext';
import { usePortfolio } from '../hooks/usePortfolio';

const PortfolioDashboard: React.FC = () => {
  const [showPremium, setShowPremium] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const { createSession } = usePaymentContext();
  const { 
    portfolio, 
    loading, 
    error, 
    totalValue, 
    totalChange24h, 
    totalChangePercent24h, 
    refetch 
  } = usePortfolio();

  const handleUnlockPremium = async () => {
    try {
      await createSession();
      setHasPaid(true);
      setShowPremium(false);
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-gray-400">Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-bg rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Portfolio Value</p>
              <p className="text-2xl font-bold text-white">${totalValue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-accent" />
          </div>
        </div>

        <div className="card-bg rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">24h Change</p>
              <p className={`text-2xl font-bold ${totalChangePercent24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totalChangePercent24h >= 0 ? '+' : ''}{totalChangePercent24h.toFixed(2)}%
              </p>
            </div>
            {totalChangePercent24h >= 0 ? 
              <TrendingUp className="w-8 h-8 text-green-400" /> : 
              <TrendingDown className="w-8 h-8 text-red-400" />
            }
          </div>
        </div>

        <div className="card-bg rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">P&L (24h)</p>
              <p className={`text-2xl font-bold ${totalChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totalChange24h >= 0 ? '+' : ''}${totalChange24h.toFixed(2)}
              </p>
            </div>
            <Percent className="w-8 h-8 text-primary" />
          </div>
        </div>
      </div>

      {/* Portfolio Chart */}
      <div className="card-bg rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Portfolio Performance</h3>
        <PortfolioChart />
      </div>

      {/* Holdings Table */}
      <div className="card-bg rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Your Holdings</h3>
          {!hasPaid && (
            <button
              onClick={() => setShowPremium(true)}
              className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors"
            >
              Unlock Premium Analytics
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 text-gray-400">Asset</th>
                <th className="text-right py-3 text-gray-400">Balance</th>
                <th className="text-right py-3 text-gray-400">Price</th>
                <th className="text-right py-3 text-gray-400">24h Change</th>
                <th className="text-right py-3 text-gray-400">Value</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.map((entry) => (
                <tr key={entry.entryId} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{entry.tokenSymbol[0]}</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{entry.tokenSymbol}</p>
                        <p className="text-gray-400 text-sm">Token</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-right py-4 text-gray-300">
                    {entry.quantity.toLocaleString()}
                  </td>
                  <td className="text-right py-4 text-gray-300">
                    ${entry.currentPrice.toFixed(6)}
                  </td>
                  <td className={`text-right py-4 ${entry.changePercent24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {entry.changePercent24h >= 0 ? '+' : ''}{entry.changePercent24h.toFixed(2)}%
                  </td>
                  <td className="text-right py-4 text-white font-medium">
                    ${entry.value.toLocaleString()}
                  </td>
                </tr>
              ))}
              {portfolio.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">
                    No tokens found in your portfolio
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Premium Unlock Modal */}
      {showPremium && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="card-bg rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Unlock Premium Analytics</h3>
            <p className="text-gray-300 mb-6">
              Get access to advanced portfolio analytics, detailed P&L tracking, and historical performance data.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleUnlockPremium}
                className="flex-1 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors"
              >
                Pay $0.001 to Unlock
              </button>
              <button
                onClick={() => setShowPremium(false)}
                className="px-4 py-2 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioDashboard;
