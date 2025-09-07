# MemeTrend Alpha

**Surf the crypto meme wave with data-driven insights.**

MemeTrend Alpha is a Base MiniApp that helps crypto enthusiasts track their portfolios and identify emerging meme coin trends using advanced social sentiment analysis and AI-powered insights.

## 🚀 Features

### Core Features
- **Real-time Portfolio Dashboard**: Aggregates all user crypto holdings from connected wallets to display current value, P&L, and performance charts
- **Memeability Score & Hype Predictor**: Analyzes social media and Farcaster data using AI to generate 'Memeability Scores' and predict short-term hype cycles
- **Next-Gen Investment Signals**: Automated alerts for significant price movements, unusual social sentiment shifts, or emerging meme trends

### Technical Features
- **Wallet Integration**: Seamless connection via RainbowKit/Wagmi
- **Real-time Data**: Live price feeds and sentiment analysis
- **Premium Features**: Advanced analytics with micro-payment integration
- **Responsive Design**: Optimized for mobile and desktop

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom design system
- **Wallet**: RainbowKit + Wagmi for Base network
- **Charts**: Recharts for data visualization
- **Payments**: x402-axios for micro-payments
- **APIs**: The Tie, Neynar (Farcaster), CoinGecko, OpenAI

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Base wallet (MetaMask, Coinbase Wallet, etc.)
- API keys for external services (see Environment Setup)

## 🚀 Quick Start

### 1. Clone and Install
```bash
git clone <repository-url>
cd memetrend-alpha
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
```

Edit `.env` with your API keys:
```env
VITE_THE_TIE_API_KEY=your_the_tie_api_key_here
VITE_NEYNAR_API_KEY=your_neynar_api_key_here
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_BASE_RPC_URL=https://mainnet.base.org
```

### 3. Development
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
npm run preview
```

## 🏗 Architecture

### Data Models

#### User
```typescript
interface User {
  userId: string;
  walletAddress: string;
  isOnchainSubscription: boolean;
  watchlist: string[];
  notificationPreferences: NotificationPreferences;
}
```

#### PortfolioEntry
```typescript
interface PortfolioEntry {
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
```

#### MemeTrend
```typescript
interface MemeTrend {
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
```

### API Integration

#### The Tie Sentiment API
- **Purpose**: Real-time and historical sentiment data for cryptocurrencies
- **Endpoint**: `/sentiment`, `/historical-sentiment`
- **Documentation**: https://www.thetie.io/solutions/sentiment-api/

#### Neynar (Farcaster) API
- **Purpose**: Access on-chain social data and user interactions from Farcaster
- **Endpoint**: `/casts`
- **Documentation**: https://docs.farcaster.xyz/

#### OpenAI/Claude API
- **Purpose**: Process unstructured social data and perform sentiment analysis
- **Endpoint**: `/v1/chat/completions` (OpenAI), `/invoke` (Claude 3)
- **Documentation**: https://platform.openai.com/docs/api-reference

#### Base RPC Endpoints
- **Purpose**: Query on-chain data for user token holdings and transactions
- **Endpoint**: `/`
- **Documentation**: https://docs.base.org/rpc

## 🎨 Design System

### Colors
```css
--accent: hsl(160, 80%, 40%)
--primary: hsl(210, 80%, 50%)
--surface: hsl(210, 30%, 15%)
--background: hsl(210, 30%, 10%)
--destructive: hsl(354, 70%, 50%)
```

### Components
- **AppShell**: Main application layout
- **Card**: Reusable card component with glassmorphism effect
- **Chart**: Line and bar chart variants
- **SignalAlert**: Alert components for trends and price movements
- **Button**: Primary, secondary, and destructive variants
- **Tabs**: Navigation tabs component

## 💰 Business Model

### Freemium Model
- **Free Tier**: Basic portfolio tracking and limited meme trend analysis
- **Premium Tier**: $0.001 micro-payments for:
  - Real-time advanced signals
  - Deeper sentiment analysis
  - Historical trend data
  - Premium memeability scores

### Payment Integration
Uses x402-axios for seamless micro-payments on Base network:
```typescript
const apiClient = withPaymentInterceptor(baseClient, walletClient);
const response = await apiClient.post("/api/payment", { amount: "$0.001" });
```

## 🔧 Development Guide

### Project Structure
```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── Header.tsx      # App header with wallet connection
│   ├── PortfolioDashboard.tsx
│   ├── TrendAnalysis.tsx
│   └── Watchlist.tsx
├── hooks/              # Custom React hooks
│   ├── usePortfolio.ts # Portfolio data management
│   ├── useTrends.ts    # Trend data management
│   └── usePaymentContext.ts
├── services/           # API services
│   └── api.ts          # Centralized API client
├── types/              # TypeScript type definitions
│   └── index.ts
└── App.tsx             # Main application component
```

### Custom Hooks

#### usePortfolio
```typescript
const { 
  portfolio, 
  loading, 
  error, 
  totalValue, 
  totalChange24h, 
  totalChangePercent24h, 
  refetch 
} = usePortfolio();
```

#### useTrends
```typescript
const { 
  trends, 
  loading, 
  error, 
  refetch, 
  topTrend, 
  emergingTrends, 
  peakHypeTrends 
} = useTrends();
```

### Adding New Features

1. **Define Types**: Add interfaces to `src/types/index.ts`
2. **Create API Methods**: Add to `src/services/api.ts`
3. **Build Hooks**: Create custom hooks in `src/hooks/`
4. **Design Components**: Build UI components with proper error handling
5. **Integrate**: Connect components to hooks and test

## 🧪 Testing

### Manual Testing Checklist
- [ ] Wallet connection works on Base network
- [ ] Portfolio data loads correctly
- [ ] Trend analysis displays real data
- [ ] Premium features require payment
- [ ] Responsive design works on mobile
- [ ] Error states display properly
- [ ] Loading states are smooth

### API Testing
```bash
# Test portfolio endpoint
curl -X GET "https://api.coingecko.com/api/v3/simple/price?ids=pepe&vs_currencies=usd&include_24hr_change=true"

# Test sentiment analysis (mock)
# Real implementation would test The Tie API
```

## 🚀 Deployment

### Environment Variables
Ensure all required environment variables are set:
- API keys for external services
- RPC URLs for blockchain data
- Payment service configuration

### Build Process
```bash
npm run build
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 📊 Analytics & Monitoring

### Key Metrics
- Daily Active Users (DAU)
- Portfolio tracking engagement
- Premium conversion rate
- API response times
- Error rates

### Performance Optimization
- Lazy loading for components
- API response caching
- Image optimization
- Bundle size optimization

## 🔒 Security

### Best Practices
- Environment variables for sensitive data
- Input validation and sanitization
- Rate limiting for API calls
- Secure wallet connection handling
- HTTPS enforcement

### Privacy
- No personal data storage
- Wallet addresses are not logged
- Optional analytics with user consent

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API integration guides

## 🗺 Roadmap

### Phase 1 (Current)
- [x] Basic portfolio tracking
- [x] Meme trend analysis
- [x] Premium features with payments
- [x] Responsive design

### Phase 2 (Planned)
- [ ] Real-time notifications
- [ ] Advanced charting
- [ ] Social trading features
- [ ] Mobile app

### Phase 3 (Future)
- [ ] AI-powered trading signals
- [ ] Cross-chain support
- [ ] Community features
- [ ] Advanced analytics dashboard

---

**Built with ❤️ for the Base ecosystem**
