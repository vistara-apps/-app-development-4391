import axios, { AxiosInstance } from 'axios';
import { 
  MemeTrend, 
  PortfolioEntry, 
  TokenPrice, 
  SentimentAnalysis, 
  ApiResponse,
  ChartDataPoint 
} from '../types';

// API Configuration
const API_CONFIG = {
  THE_TIE_BASE_URL: 'https://api.thetie.io/v1',
  NEYNAR_BASE_URL: 'https://api.neynar.com/v2',
  COINGECKO_BASE_URL: 'https://api.coingecko.com/api/v3',
  BASE_RPC_URL: 'https://mainnet.base.org',
  // These would normally come from environment variables
  THE_TIE_API_KEY: process.env.VITE_THE_TIE_API_KEY || '',
  NEYNAR_API_KEY: process.env.VITE_NEYNAR_API_KEY || '',
  OPENAI_API_KEY: process.env.VITE_OPENAI_API_KEY || '',
};

class ApiService {
  private theTieClient: AxiosInstance;
  private neynarClient: AxiosInstance;
  private coinGeckoClient: AxiosInstance;

  constructor() {
    // The Tie API client
    this.theTieClient = axios.create({
      baseURL: API_CONFIG.THE_TIE_BASE_URL,
      headers: {
        'Authorization': `Bearer ${API_CONFIG.THE_TIE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    // Neynar (Farcaster) API client
    this.neynarClient = axios.create({
      baseURL: API_CONFIG.NEYNAR_BASE_URL,
      headers: {
        'api_key': API_CONFIG.NEYNAR_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    // CoinGecko API client (free tier)
    this.coinGeckoClient = axios.create({
      baseURL: API_CONFIG.COINGECKO_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Portfolio Services
  async getPortfolioData(walletAddress: string): Promise<ApiResponse<PortfolioEntry[]>> {
    try {
      // This would integrate with Base RPC to get actual token balances
      // For now, we'll use CoinGecko for price data and mock the portfolio
      const mockTokens = [
        { symbol: 'PEPE', address: '0x6982508145454ce325ddbe47a25d4ec3d2311933', balance: 1000000 },
        { symbol: 'DOGE', address: '0x4206931337dc273a630d328da6441786bfad668f', balance: 5000 },
        { symbol: 'SHIB', address: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce', balance: 50000000 },
      ];

      const portfolioEntries: PortfolioEntry[] = [];

      for (const token of mockTokens) {
        try {
          const priceData = await this.getTokenPrice(token.symbol);
          if (priceData.success && priceData.data) {
            const entry: PortfolioEntry = {
              entryId: `${walletAddress}-${token.symbol}`,
              userId: walletAddress,
              tokenSymbol: token.symbol,
              tokenAddress: token.address,
              quantity: token.balance,
              purchasePrice: priceData.data.price * 0.8, // Mock purchase price
              currentPrice: priceData.data.price,
              purchaseDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
              lastUpdated: new Date().toISOString(),
              value: token.balance * priceData.data.price,
              change24h: priceData.data.change24h,
              changePercent24h: priceData.data.change24h,
            };
            portfolioEntries.push(entry);
          }
        } catch (error) {
          console.error(`Error fetching price for ${token.symbol}:`, error);
        }
      }

      return {
        success: true,
        data: portfolioEntries,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Token Price Services
  async getTokenPrice(symbol: string): Promise<ApiResponse<TokenPrice>> {
    try {
      const response = await this.coinGeckoClient.get(`/simple/price`, {
        params: {
          ids: this.getCoingeckoId(symbol),
          vs_currencies: 'usd',
          include_24hr_change: true,
          include_24hr_vol: true,
          include_market_cap: true,
        },
      });

      const coinId = this.getCoingeckoId(symbol);
      const data = response.data[coinId];

      if (!data) {
        throw new Error(`Price data not found for ${symbol}`);
      }

      const tokenPrice: TokenPrice = {
        symbol,
        address: '', // Would need to be mapped
        price: data.usd,
        change24h: data.usd_24h_change || 0,
        volume24h: data.usd_24h_vol || 0,
        marketCap: data.usd_market_cap || 0,
        lastUpdated: new Date().toISOString(),
      };

      return {
        success: true,
        data: tokenPrice,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Sentiment Analysis Services
  async getSentimentData(symbol: string): Promise<ApiResponse<SentimentAnalysis>> {
    try {
      // This would integrate with The Tie API for real sentiment data
      // For now, we'll return mock data with realistic structure
      const mockSentiment: SentimentAnalysis = {
        overall: this.getRandomSentiment(),
        score: Math.random() * 2 - 1, // -1 to 1
        confidence: Math.random() * 0.5 + 0.5, // 0.5 to 1
        sources: [
          {
            platform: 'farcaster',
            mentions: Math.floor(Math.random() * 1000) + 100,
            sentiment: Math.random() * 2 - 1,
            volume: Math.floor(Math.random() * 10000) + 1000,
          },
          {
            platform: 'twitter',
            mentions: Math.floor(Math.random() * 5000) + 500,
            sentiment: Math.random() * 2 - 1,
            volume: Math.floor(Math.random() * 50000) + 5000,
          },
        ],
      };

      return {
        success: true,
        data: mockSentiment,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Meme Trend Analysis
  async getMemeabilityScore(symbol: string): Promise<ApiResponse<number>> {
    try {
      // This would use OpenAI/Claude to analyze social data and generate memeability scores
      // For now, we'll return a mock score based on some basic heuristics
      const sentimentData = await this.getSentimentData(symbol);
      const priceData = await this.getTokenPrice(symbol);

      let score = 50; // Base score

      if (sentimentData.success && sentimentData.data) {
        // Adjust based on sentiment
        score += sentimentData.data.score * 20;
        score += sentimentData.data.sources.reduce((acc, source) => acc + source.mentions, 0) / 100;
      }

      if (priceData.success && priceData.data) {
        // Adjust based on price movement
        score += Math.min(priceData.data.change24h, 50);
      }

      // Ensure score is between 0 and 100
      score = Math.max(0, Math.min(100, score));

      return {
        success: true,
        data: Math.round(score),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Trending Meme Coins
  async getTrendingMemeCoins(): Promise<ApiResponse<MemeTrend[]>> {
    try {
      const memeCoins = ['PEPE', 'DOGE', 'SHIB', 'FLOKI', 'BONK', 'WIF', 'MYRO', 'BRETT'];
      const trends: MemeTrend[] = [];

      for (const symbol of memeCoins) {
        try {
          const [sentimentData, memeabilityScore, priceData] = await Promise.all([
            this.getSentimentData(symbol),
            this.getMemeabilityScore(symbol),
            this.getTokenPrice(symbol),
          ]);

          if (sentimentData.success && memeabilityScore.success && priceData.success) {
            const trend: MemeTrend = {
              trendId: `trend-${symbol}-${Date.now()}`,
              tokenSymbol: symbol,
              tokenAddress: '', // Would need to be mapped
              name: this.getTokenName(symbol),
              memeabilityScore: memeabilityScore.data!,
              hypePrediction: this.getHypePrediction(memeabilityScore.data!, priceData.data!.change24h),
              sentimentAnalysis: sentimentData.data!,
              trendStartDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
              lastUpdated: new Date().toISOString(),
              volume24h: priceData.data!.volume24h,
              mentions: sentimentData.data!.sources.reduce((acc, source) => acc + source.mentions, 0),
              socialScore: Math.round(sentimentData.data!.score * 50 + 50),
              isPremium: Math.random() > 0.5,
            };
            trends.push(trend);
          }
        } catch (error) {
          console.error(`Error processing ${symbol}:`, error);
        }
      }

      // Sort by memeability score
      trends.sort((a, b) => b.memeabilityScore - a.memeabilityScore);

      return {
        success: true,
        data: trends,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Chart Data
  async getChartData(symbol: string, timeframe: '1h' | '24h' | '7d' | '30d'): Promise<ApiResponse<ChartDataPoint[]>> {
    try {
      // This would fetch real historical data
      // For now, we'll generate mock chart data
      const points = timeframe === '1h' ? 60 : timeframe === '24h' ? 24 : timeframe === '7d' ? 7 : 30;
      const basePrice = Math.random() * 0.1 + 0.001;
      const chartData: ChartDataPoint[] = [];

      for (let i = 0; i < points; i++) {
        const timestamp = new Date(Date.now() - (points - i) * this.getTimeInterval(timeframe)).toISOString();
        const variation = (Math.random() - 0.5) * 0.1;
        const value = basePrice * (1 + variation);
        
        chartData.push({
          timestamp,
          value,
          volume: Math.random() * 1000000,
        });
      }

      return {
        success: true,
        data: chartData,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Helper methods
  private getCoingeckoId(symbol: string): string {
    const mapping: Record<string, string> = {
      'PEPE': 'pepe',
      'DOGE': 'dogecoin',
      'SHIB': 'shiba-inu',
      'FLOKI': 'floki',
      'BONK': 'bonk',
      'WIF': 'dogwifcoin',
      'MYRO': 'myro',
      'BRETT': 'brett',
    };
    return mapping[symbol] || symbol.toLowerCase();
  }

  private getTokenName(symbol: string): string {
    const mapping: Record<string, string> = {
      'PEPE': 'Pepe',
      'DOGE': 'Dogecoin',
      'SHIB': 'Shiba Inu',
      'FLOKI': 'Floki Inu',
      'BONK': 'Bonk',
      'WIF': 'dogwifhat',
      'MYRO': 'Myro',
      'BRETT': 'Brett',
    };
    return mapping[symbol] || symbol;
  }

  private getRandomSentiment(): SentimentAnalysis['overall'] {
    const sentiments: SentimentAnalysis['overall'][] = ['Bullish', 'Bearish', 'Neutral', 'Euphoric', 'Fearful'];
    return sentiments[Math.floor(Math.random() * sentiments.length)];
  }

  private getHypePrediction(memeabilityScore: number, priceChange: number): MemeTrend['hypePrediction'] {
    if (memeabilityScore > 80 && priceChange > 20) return 'Peak';
    if (memeabilityScore > 70 && priceChange > 10) return 'Rising';
    if (memeabilityScore > 60) return 'Emerging';
    if (priceChange < -10) return 'Declining';
    return 'Stable';
  }

  private getTimeInterval(timeframe: string): number {
    switch (timeframe) {
      case '1h': return 60 * 1000; // 1 minute
      case '24h': return 60 * 60 * 1000; // 1 hour
      case '7d': return 24 * 60 * 60 * 1000; // 1 day
      case '30d': return 24 * 60 * 60 * 1000; // 1 day
      default: return 60 * 60 * 1000;
    }
  }
}

export const apiService = new ApiService();
