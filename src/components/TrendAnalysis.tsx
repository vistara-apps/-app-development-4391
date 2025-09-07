import React, { useState } from 'react';
import { TrendingUp, Zap, Target, Lock } from 'lucide-react';
import { usePaymentContext } from '../hooks/usePaymentContext';

const mockTrendData = [
  {
    symbol: 'BONK',
    name: 'Bonk',
    memeabilityScore: 92,
    hypePrediction: 'Rising',
    sentiment: 'Bullish',
    change24h: 45.2,
    volume: '12.5M',
    mentions: 1240,
    isPremium: false
  },
  {
    symbol: 'WIF',
    name: 'dogwifhat',
    memeabilityScore: 87,
    hypePrediction: 'Peak',
    sentiment: 'Euphoric',
    change24h: 23.1,
    volume: '8.2M',
    mentions: 890,
    isPremium: false
  },
  {
    symbol: 'MYRO',
    name: 'Myro',
    memeabilityScore: 78,
    hypePrediction: 'Emerging',
    sentiment: 'Optimistic',
    change24h: 12.8,
    volume: '3.4M',
    mentions: 456,
    isPremium: true
  },
  {
    symbol: 'BRETT',
    name: 'Brett',
    memeabilityScore: 73,
    hypePrediction: 'Stable',
    sentiment: 'Neutral',
    change24h: -2.3,
    volume: '5.1M',
    mentions: 234,
    isPremium: true
  }
];

const TrendAnalysis: React.FC = () => {
  const [showPremium, setShowPremium] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const { createSession } = usePaymentContext();

  const handleUnlockPremium = async () => {
    try {
      await createSession();
      setHasPaid(true);
      setShowPremium(false);
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getPredictionColor = (prediction: string) => {
    switch (prediction) {
      case 'Rising': return 'text-green-400';
      case 'Peak': return 'text-yellow-400';
      case 'Emerging': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Meme Trend Analysis</h2>
          <p className="text-gray-400">AI-powered insights into crypto meme culture</p>
        </div>
        {!hasPaid && (
          <button
            onClick={() => setShowPremium(true)}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors flex items-center space-x-2"
          >
            <Zap className="w-4 h-4" />
            <span>Unlock Premium Trends</span>
          </button>
        )}
      </div>

      {/* Top Trending */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-bg rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <TrendingUp className="w-6 h-6 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Hottest Meme</h3>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-white">BONK</p>
            <p className="text-green-400">+45.2% (24h)</p>
            <p className="text-sm text-gray-400">Memeability Score: 92/100</p>
          </div>
        </div>

        <div className="card-bg rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <Target className="w-6 h-6 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">Peak Hype</h3>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-white">WIF</p>
            <p className="text-yellow-400">Euphoric Sentiment</p>
            <p className="text-sm text-gray-400">1,240 mentions</p>
          </div>
        </div>

        <div className="card-bg rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <Zap className="w-6 h-6 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Emerging Trend</h3>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-white">MYRO</p>
            <p className="text-blue-400">Rising Momentum</p>
            <p className="text-sm text-gray-400">Score: 78/100</p>
          </div>
        </div>
      </div>

      {/* Trend Table */}
      <div className="card-bg rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Meme Coin Rankings</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 text-gray-400">Coin</th>
                <th className="text-center py-3 text-gray-400">Memeability</th>
                <th className="text-center py-3 text-gray-400">Hype</th>
                <th className="text-center py-3 text-gray-400">Sentiment</th>
                <th className="text-right py-3 text-gray-400">24h Change</th>
                <th className="text-right py-3 text-gray-400">Volume</th>
              </tr>
            </thead>
            <tbody>
              {mockTrendData.map((coin) => (
                <tr key={coin.symbol} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{coin.symbol[0]}</span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="text-white font-medium">{coin.symbol}</p>
                          {coin.isPremium && !hasPaid && (
                            <Lock className="w-3 h-3 text-yellow-400" />
                          )}
                        </div>
                        <p className="text-gray-400 text-sm">{coin.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-center py-4">
                    <span className={`font-bold ${getScoreColor(coin.memeabilityScore)}`}>
                      {coin.isPremium && !hasPaid ? '--' : coin.memeabilityScore}
                    </span>
                  </td>
                  <td className="text-center py-4">
                    <span className={`${getPredictionColor(coin.hypePrediction)}`}>
                      {coin.isPremium && !hasPaid ? 'Premium' : coin.hypePrediction}
                    </span>
                  </td>
                  <td className="text-center py-4 text-gray-300">
                    {coin.isPremium && !hasPaid ? '---' : coin.sentiment}
                  </td>
                  <td className={`text-right py-4 ${coin.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {coin.change24h >= 0 ? '+' : ''}{coin.change24h}%
                  </td>
                  <td className="text-right py-4 text-gray-300">
                    {coin.isPremium && !hasPaid ? '---' : coin.volume}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Premium Modal */}
      {showPremium && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="card-bg rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Unlock Premium Trends</h3>
            <p className="text-gray-300 mb-6">
              Access advanced memeability scores, hype predictions, and exclusive trend analysis for emerging coins.
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

export default TrendAnalysis;