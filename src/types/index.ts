// Core data models as specified in the PRD

export interface User {
  userId: string;
  walletAddress: string;
  isOnchainSubscription: boolean;
  watchlist: string[];
  notificationPreferences: NotificationPreferences;
}

export interface NotificationPreferences {
  priceAlerts: boolean;
  sentimentAlerts: boolean;
  trendAlerts: boolean;
  email: string | null;
}

export interface PortfolioEntry {
  entryId: string;
  userId: string;
  tokenSymbol: string;
  tokenAddress: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: string;
  lastUpdated: string;
  value: number;
  change24h: number;
  changePercent24h: number;
}

export interface MemeTrend {
  trendId: string;
  tokenSymbol: string;
  tokenAddress: string;
  name: string;
  memeabilityScore: number;
  hypePrediction: 'Rising' | 'Peak' | 'Emerging' | 'Stable' | 'Declining';
  sentimentAnalysis: SentimentAnalysis;
  trendStartDate: string;
  lastUpdated: string;
  volume24h: number;
  mentions: number;
  socialScore: number;
  isPremium: boolean;
}

export interface SentimentAnalysis {
  overall: 'Bullish' | 'Bearish' | 'Neutral' | 'Euphoric' | 'Fearful';
  score: number; // -1 to 1
  confidence: number; // 0 to 1
  sources: SentimentSource[];
}

export interface SentimentSource {
  platform: 'farcaster' | 'twitter' | 'reddit' | 'telegram';
  mentions: number;
  sentiment: number;
  volume: number;
}

export interface TokenPrice {
  symbol: string;
  address: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  lastUpdated: string;
}

export interface Alert {
  id: string;
  userId: string;
  tokenSymbol: string;
  type: 'price' | 'sentiment' | 'volume' | 'trend';
  condition: AlertCondition;
  isActive: boolean;
  createdAt: string;
  triggeredAt?: string;
}

export interface AlertCondition {
  priceAbove?: number;
  priceBelow?: number;
  sentimentChange?: number;
  volumeIncrease?: number;
  memeabilityScore?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface ChartDataPoint {
  timestamp: string;
  value: number;
  volume?: number;
}

// API Configuration
export interface ApiConfig {
  theTieApiKey: string;
  neynarApiKey: string;
  openaiApiKey: string;
  baseRpcUrl: string;
}
