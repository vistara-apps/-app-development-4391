import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import Header from './components/Header';
import PortfolioDashboard from './components/PortfolioDashboard';
import TrendAnalysis from './components/TrendAnalysis';
import Watchlist from './components/Watchlist';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/Tabs';

function App() {
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState('portfolio');

  if (!isConnected) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold text-white">MemeTrend Alpha</h1>
            <p className="text-lg text-gray-300">Surf the crypto meme wave with data-driven insights</p>
          </div>
          <div className="card-bg rounded-xl p-6 space-y-4">
            <p className="text-gray-400">Connect your wallet to start tracking your portfolio and discovering trending meme coins</p>
            <Header />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="space-y-6">
            <PortfolioDashboard />
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <TrendAnalysis />
          </TabsContent>

          <TabsContent value="watchlist" className="space-y-6">
            <Watchlist />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default App;