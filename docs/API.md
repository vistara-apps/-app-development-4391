# MemeTrend Alpha API Documentation

This document outlines the API integrations and data flow for MemeTrend Alpha.

## Overview

MemeTrend Alpha integrates with multiple external APIs to provide comprehensive meme coin analysis:

- **The Tie API**: Sentiment analysis and social metrics
- **Neynar API**: Farcaster social data
- **CoinGecko API**: Price data and market information
- **OpenAI/Claude API**: AI-powered analysis and scoring
- **Base RPC**: On-chain data for portfolio tracking

## API Service Architecture

### Core Service Class

```typescript
class ApiService {
  private theTieClient: AxiosInstance;
  private neynarClient: AxiosInstance;
  private coinGeckoClient: AxiosInstance;
  
  // Service methods...
}
```

## API Endpoints

### 1. Portfolio Data

#### `getPortfolioData(walletAddress: string)`

Retrieves portfolio data for a connected wallet.

**Parameters:**
- `walletAddress`: User's wallet address

**Returns:**
```typescript
ApiResponse<PortfolioEntry[]>
```

**Implementation:**
- Fetches token balances from Base RPC
- Gets current prices from CoinGecko
- Calculates P&L and portfolio metrics

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "entryId": "0x123...abc-PEPE",
      "userId": "0x123...abc",
      "tokenSymbol": "PEPE",
      "tokenAddress": "0x6982508145454ce325ddbe47a25d4ec3d2311933",
      "quantity": 1000000,
      "purchasePrice": 0.000001,
      "currentPrice": 0.000001234,
      "purchaseDate": "2024-01-01T00:00:00Z",
      "lastUpdated": "2024-01-15T12:00:00Z",
      "value": 1234,
      "change24h": 15.2,
      "changePercent24h": 15.2
    }
  ],
  "timestamp": "2024-01-15T12:00:00Z"
}
```

### 2. Token Price Data

#### `getTokenPrice(symbol: string)`

Gets current price and market data for a token.

**Parameters:**
- `symbol`: Token symbol (e.g., "PEPE", "DOGE")

**Returns:**
```typescript
ApiResponse<TokenPrice>
```

**CoinGecko Integration:**
```typescript
const response = await this.coinGeckoClient.get('/simple/price', {
  params: {
    ids: this.getCoingeckoId(symbol),
    vs_currencies: 'usd',
    include_24hr_change: true,
    include_24hr_vol: true,
    include_market_cap: true,
  },
});
```

### 3. Sentiment Analysis

#### `getSentimentData(symbol: string)`

Analyzes social sentiment for a token across multiple platforms.

**Parameters:**
- `symbol`: Token symbol

**Returns:**
```typescript
ApiResponse<SentimentAnalysis>
```

**Data Sources:**
- Farcaster mentions and sentiment
- Twitter/X social metrics
- Reddit discussions
- Telegram groups

**Example Response:**
```json
{
  "success": true,
  "data": {
    "overall": "Bullish",
    "score": 0.75,
    "confidence": 0.85,
    "sources": [
      {
        "platform": "farcaster",
        "mentions": 1240,
        "sentiment": 0.8,
        "volume": 15000
      },
      {
        "platform": "twitter",
        "mentions": 5600,
        "sentiment": 0.7,
        "volume": 45000
      }
    ]
  },
  "timestamp": "2024-01-15T12:00:00Z"
}
```

### 4. Memeability Scoring

#### `getMemeabilityScore(symbol: string)`

Generates an AI-powered memeability score for a token.

**Algorithm:**
1. Collect social sentiment data
2. Analyze price movement patterns
3. Evaluate community engagement
4. Apply AI scoring model
5. Return score (0-100)

**Scoring Factors:**
- Social media mentions and sentiment
- Price volatility and momentum
- Community size and engagement
- Meme potential and virality
- Historical performance

### 5. Trending Analysis

#### `getTrendingMemeCoins()`

Returns trending meme coins with comprehensive analysis.

**Returns:**
```typescript
ApiResponse<MemeTrend[]>
```

**Analysis Includes:**
- Memeability scores
- Hype predictions
- Sentiment analysis
- Volume and mention metrics
- Premium insights

### 6. Chart Data

#### `getChartData(symbol: string, timeframe: string)`

Provides historical price data for charting.

**Parameters:**
- `symbol`: Token symbol
- `timeframe`: '1h' | '24h' | '7d' | '30d'

**Returns:**
```typescript
ApiResponse<ChartDataPoint[]>
```

## External API Integrations

### The Tie API

**Base URL:** `https://api.thetie.io/v1`

**Authentication:**
```typescript
headers: {
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json',
}
```

**Key Endpoints:**
- `/sentiment` - Real-time sentiment data
- `/historical-sentiment` - Historical sentiment trends
- `/social-volume` - Social media volume metrics

**Rate Limits:** 1000 requests/hour (free tier)

### Neynar (Farcaster) API

**Base URL:** `https://api.neynar.com/v2`

**Authentication:**
```typescript
headers: {
  'api_key': API_KEY,
  'Content-Type': 'application/json',
}
```

**Key Endpoints:**
- `/casts` - Farcaster cast data
- `/users` - User information
- `/channels` - Channel data

**Rate Limits:** 10,000 requests/day (free tier)

### CoinGecko API

**Base URL:** `https://api.coingecko.com/api/v3`

**Authentication:** None required (free tier)

**Key Endpoints:**
- `/simple/price` - Current token prices
- `/coins/{id}/market_chart` - Historical price data
- `/coins/markets` - Market data

**Rate Limits:** 50 calls/minute (free tier)

### OpenAI API

**Base URL:** `https://api.openai.com/v1`

**Authentication:**
```typescript
headers: {
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json',
}
```

**Usage:**
- Sentiment analysis of social media content
- Memeability scoring algorithms
- Trend prediction models

## Error Handling

### Standard Error Response

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}
```

### Error Types

1. **Network Errors**
   - Connection timeouts
   - DNS resolution failures
   - SSL certificate issues

2. **API Errors**
   - Rate limit exceeded (429)
   - Authentication failed (401)
   - Resource not found (404)
   - Server errors (5xx)

3. **Data Errors**
   - Invalid token symbols
   - Missing price data
   - Malformed responses

### Retry Logic

```typescript
const retryConfig = {
  retries: 3,
  retryDelay: (retryCount) => Math.pow(2, retryCount) * 1000,
  retryCondition: (error) => {
    return error.response?.status >= 500 || error.code === 'ECONNABORTED';
  }
};
```

## Caching Strategy

### Cache Levels

1. **Browser Cache**
   - Static assets (24 hours)
   - API responses (5 minutes)

2. **Service Worker Cache**
   - Offline functionality
   - Background sync

3. **Memory Cache**
   - Frequently accessed data
   - User session data

### Cache Keys

```typescript
const cacheKeys = {
  portfolio: `portfolio_${walletAddress}`,
  trends: 'trending_meme_coins',
  prices: `price_${symbol}`,
  sentiment: `sentiment_${symbol}`,
};
```

## Rate Limiting

### Client-Side Rate Limiting

```typescript
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  canMakeRequest(endpoint: string, limit: number, window: number): boolean {
    // Implementation...
  }
}
```

### API Quotas

| Service | Free Tier | Paid Tier |
|---------|-----------|-----------|
| The Tie | 1,000/hour | 10,000/hour |
| Neynar | 10,000/day | 100,000/day |
| CoinGecko | 50/minute | 500/minute |
| OpenAI | $5 credit | Pay-per-use |

## Security Considerations

### API Key Management

```typescript
// Environment variables
const API_CONFIG = {
  THE_TIE_API_KEY: process.env.VITE_THE_TIE_API_KEY,
  NEYNAR_API_KEY: process.env.VITE_NEYNAR_API_KEY,
  OPENAI_API_KEY: process.env.VITE_OPENAI_API_KEY,
};
```

### Request Validation

- Input sanitization
- Parameter validation
- Response schema validation
- CORS configuration

### Data Privacy

- No personal data storage
- Wallet addresses are hashed
- Optional analytics tracking
- GDPR compliance

## Performance Optimization

### Request Optimization

1. **Parallel Requests**
   ```typescript
   const [sentiment, price, trends] = await Promise.all([
     getSentimentData(symbol),
     getTokenPrice(symbol),
     getTrendingMemeCoins()
   ]);
   ```

2. **Request Batching**
   - Combine multiple token requests
   - Batch sentiment analysis
   - Aggregate chart data

3. **Lazy Loading**
   - Load data on demand
   - Progressive enhancement
   - Background updates

### Response Optimization

- Gzip compression
- JSON minification
- Selective field loading
- Pagination for large datasets

## Monitoring and Analytics

### API Metrics

- Response times
- Error rates
- Success rates
- Cache hit ratios

### Business Metrics

- User engagement
- Premium conversions
- Feature usage
- Retention rates

### Alerting

```typescript
const alerts = {
  highErrorRate: errorRate > 0.05,
  slowResponse: avgResponseTime > 2000,
  rateLimitHit: rateLimitExceeded,
  apiDown: !healthCheck.success
};
```

## Testing

### Unit Tests

```typescript
describe('ApiService', () => {
  it('should fetch portfolio data', async () => {
    const result = await apiService.getPortfolioData('0x123');
    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(3);
  });
});
```

### Integration Tests

- Mock API responses
- Test error scenarios
- Validate data transformations
- Check rate limiting

### Load Testing

- Concurrent user simulation
- API endpoint stress testing
- Performance benchmarking
- Scalability analysis

## Future Enhancements

### Planned Features

1. **Real-time WebSocket Connections**
   - Live price updates
   - Real-time sentiment changes
   - Push notifications

2. **Advanced Analytics**
   - Machine learning models
   - Predictive analytics
   - Custom indicators

3. **Multi-chain Support**
   - Ethereum integration
   - Polygon support
   - Cross-chain analytics

4. **Enhanced Social Data**
   - Discord integration
   - YouTube sentiment
   - TikTok trend analysis

### API Versioning

```typescript
const API_VERSIONS = {
  v1: '/api/v1',
  v2: '/api/v2', // Future version
};
```

---

This API documentation provides a comprehensive overview of MemeTrend Alpha's data integration strategy and implementation details.
