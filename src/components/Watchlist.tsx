import React, { useState } from 'react';
import { Plus, Search, Bell, BellOff, Trash2 } from 'lucide-react';

const mockWatchlistData = [
  {
    symbol: 'MEME',
    name: 'Memecoin',
    price: 0.023,
    change24h: 12.5,
    alerts: true,
    priceAlert: 0.025,
    volumeAlert: true
  },
  {
    symbol: 'PEPECOIN',
    name: 'PepeCoin',
    price: 0.00045,
    change24h: -5.2,
    alerts: false,
    priceAlert: null,
    volumeAlert: false
  },
  {
    symbol: 'WOJAK',
    name: 'Wojak',
    price: 0.156,
    change24h: 8.9,
    alerts: true,
    priceAlert: 0.20,
    volumeAlert: true
  }
];

const Watchlist: React.FC = () => {
  const [watchlist, setWatchlist] = useState(mockWatchlistData);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const toggleAlert = (symbol: string) => {
    setWatchlist(prev => prev.map(coin => 
      coin.symbol === symbol 
        ? { ...coin, alerts: !coin.alerts }
        : coin
    ));
  };

  const removeCoin = (symbol: string) => {
    setWatchlist(prev => prev.filter(coin => coin.symbol !== symbol));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-white">Watchlist</h2>
          <p className="text-gray-400">Track your favorite meme coins and set alerts</p>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search coins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-surface border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Coin</span>
          </button>
        </div>
      </div>

      {/* Watchlist Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {watchlist.map((coin) => (
          <div key={coin.symbol} className="card-bg rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">{coin.symbol[0]}</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">{coin.symbol}</h3>
                  <p className="text-gray-400 text-sm">{coin.name}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleAlert(coin.symbol)}
                  className={`p-2 rounded-lg transition-colors ${
                    coin.alerts 
                      ? 'bg-accent text-white' 
                      : 'bg-surface border border-white/20 text-gray-400 hover:text-white'
                  }`}
                >
                  {coin.alerts ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => removeCoin(coin.symbol)}
                  className="p-2 bg-surface border border-white/20 text-gray-400 hover:text-red-400 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Price</span>
                <span className="text-white font-medium">${coin.price}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">24h Change</span>
                <span className={`font-medium ${coin.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {coin.change24h >= 0 ? '+' : ''}{coin.change24h}%
                </span>
              </div>

              {coin.alerts && coin.priceAlert && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Price Alert</span>
                  <span className="text-yellow-400">${coin.priceAlert}</span>
                </div>
              )}

              {coin.alerts && (
                <div className="pt-2 border-t border-white/10">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-3 h-3 text-accent" />
                    <span className="text-xs text-gray-400">
                      Alerts enabled for price and volume changes
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Coin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="card-bg rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Add to Watchlist</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Coin Symbol</label>
                <input
                  type="text"
                  placeholder="e.g., PEPE, DOGE"
                  className="w-full px-3 py-2 bg-surface border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="enable-alerts" className="rounded" />
                <label htmlFor="enable-alerts" className="text-sm text-gray-300">
                  Enable price alerts
                </label>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors"
              >
                Add to Watchlist
              </button>
              <button
                onClick={() => setShowAddModal(false)}
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

export default Watchlist;