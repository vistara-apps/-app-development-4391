import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react';
import PortfolioChart from './PortfolioChart';
import { usePaymentContext } from '../hooks/usePaymentContext';

const mockPortfolioData = [
  { symbol: 'PEPE', name: 'Pepe', balance: 1000000, price: 0.000001234, change24h: 15.2, value: 1234 },
  { symbol: 'DOGE', name: 'Dogecoin', balance: 5000, price: 0.08, change24h: -3.1, value: 400 },
  { symbol: 'SHIB', name: 'Shiba Inu', balance: 50000000, price: 0.000008, change24h: 8.7, value: 400 },
  { symbol: 'FLOKI', name: 'Floki Inu', balance: 100000, price: 0.00003, change24h: 22.1, value: 3000 },
];

const PortfolioDashboard: React.FC = () => {
  const [showPremium, setShowPremium] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const { createSession } = usePaymentContext();

  const totalValue = mockPortfolioData.reduce((sum, token) => sum + token.value, 0);
  const totalChange = mockPortfolioData.reduce((sum, token) => sum + (token.value * token.change24h / 100), 0);
  const totalChangePercent = (totalChange / totalValue) * 100;

  const handleUnlockPremium = async () => {
    try {
      await createSession();
      setHasPaid(true);
      setShowPremium(false);
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

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
              <p className={`text-2xl font-bold ${totalChangePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totalChangePercent >= 0 ? '+' : ''}{totalChangePercent.toFixed(2)}%
              </p>
            </div>
            {totalChangePercent >= 0 ? 
              <TrendingUp className="w-8 h-8 text-green-400" /> : 
              <TrendingDown className="w-8 h-8 text-red-400" />
            }
          </div>
        </div>

        <div className="card-bg rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">P&L (24h)</p>
              <p className={`text-2xl font-bold ${totalChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totalChange >= 0 ? '+' : ''}${totalChange.toFixed(2)}
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
              {mockPortfolioData.map((token) => (
                <tr key={token.symbol} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{token.symbol[0]}</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{token.symbol}</p>
                        <p className="text-gray-400 text-sm">{token.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-right py-4 text-gray-300">
                    {token.balance.toLocaleString()}
                  </td>
                  <td className="text-right py-4 text-gray-300">
                    ${token.price}
                  </td>
                  <td className={`text-right py-4 ${token.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {token.change24h >= 0 ? '+' : ''}{token.change24h}%
                  </td>
                  <td className="text-right py-4 text-white font-medium">
                    ${token.value.toLocaleString()}
                  </td>
                </tr>
              ))}
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