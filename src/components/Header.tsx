import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { TrendingUp } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="border-b border-white/10 bg-black/20 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">MemeTrend Alpha</h1>
            <p className="text-sm text-gray-400 hidden sm:block">Crypto insights & meme trends</p>
          </div>
        </div>
        
        <ConnectButton />
      </div>
    </header>
  );
};

export default Header;