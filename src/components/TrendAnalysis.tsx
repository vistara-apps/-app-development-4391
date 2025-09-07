import React, { useState } from 'react';
import { TrendingUp, Zap, Target, Lock } from 'lucide-react';
import LoadingSpinner from './ui/LoadingSpinner';
import ErrorMessage from './ui/ErrorMessage';
import { usePaymentContext } from '../hooks/usePaymentContext';
import { useTrends } from '../hooks/useTrends';

const TrendAnalysis: React.FC = () => {
  const [showPremium, setShowPremium] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const { createSession } = usePaymentContext();
  const { 
    trends, 
    loading, 
    error, 
    refetch, 
    topTrend, 
    emergingTrends, 
    peakHypeTrends 
  } = useTrends();

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-gray-400">Analyzing meme trends...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refetch} />;
  }

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    }
    if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
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
            <p className="text-2xl font-bold text-white">{topTrend?.tokenSymbol || 'N/A'}</p>
            <p className="text-green-400">
              {topTrend ? `${topTrend.sentimentAnalysis.overall} Sentiment` : 'No data'}
            </p>
            <p className="text-sm text-gray-400">
              Memeability Score: {topTrend?.memeabilityScore || 0}/100
            </p>
          </div>
        </div>

        <div className="card-bg rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <Target className="w-6 h-6 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">Peak Hype</h3>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-white">
              {peakHypeTrends[0]?.tokenSymbol || 'N/A'}
            </p>
            <p className="text-yellow-400">
              {peakHypeTrends[0]?.sentimentAnalysis.overall || 'No data'} Sentiment
            </p>
            <p className="text-sm text-gray-400">
              {peakHypeTrends[0]?.mentions.toLocaleString() || 0} mentions
            </p>
          </div>
        </div>

        <div className="card-bg rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <Zap className="w-6 h-6 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Emerging Trend</h3>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-white">
              {emergingTrends[0]?.tokenSymbol || 'N/A'}
            </p>
            <p className="text-blue-400">Rising Momentum</p>
            <p className="text-sm text-gray-400">
              Score: {emergingTrends[0]?.memeabilityScore || 0}/100
            </p>
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
              {trends.map((trend) => (
                <tr key={trend.trendId} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{trend.tokenSymbol[0]}</span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="text-white font-medium">{trend.tokenSymbol}</p>
                          {trend.isPremium && !hasPaid && (
                            <Lock className="w-3 h-3 text-yellow-400" />
                          )}
                        </div>
                        <p className="text-gray-400 text-sm">{trend.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-center py-4">
                    <span className={`font-bold ${getScoreColor(trend.memeabilityScore)}`}>
                      {trend.isPremium && !hasPaid ? '--' : trend.memeabilityScore}
                    </span>
                  </td>
                  <td className="text-center py-4">
                    <span className={`${getPredictionColor(trend.hypePrediction)}`}>
                      {trend.isPremium && !hasPaid ? 'Premium' : trend.hypePrediction}
                    </span>
                  </td>
                  <td className="text-center py-4 text-gray-300">
                    {trend.isPremium && !hasPaid ? '---' : trend.sentimentAnalysis.overall}
                  </td>
                  <td className={`text-right py-4 ${trend.sentimentAnalysis.score >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {trend.sentimentAnalysis.score >= 0 ? '+' : ''}{(trend.sentimentAnalysis.score * 100).toFixed(1)}%
                  </td>
                  <td className="text-right py-4 text-gray-300">
                    {trend.isPremium && !hasPaid ? '---' : formatVolume(trend.volume24h)}
                  </td>
                </tr>
              ))}
              {trends.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    No trend data available
                  </td>
                </tr>
              )}
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
