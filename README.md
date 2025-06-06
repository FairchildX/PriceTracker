# PriceTracker 🚀

A simple and elegant cryptocurrency price tracking tool with real-time updates and price alerts.

## Features

- 📊 **Real-time Price Tracking**: Monitor multiple cryptocurrencies with live price updates
- 🚨 **Price Alerts**: Set target prices and get notifications when they're reached
- 💾 **Local Storage**: Your tracked cryptocurrencies persist between sessions
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- 🔄 **Auto-refresh**: Prices update automatically every 30 seconds
- 🎨 **Clean UI**: Modern, intuitive interface with visual price indicators

## Tech Stack

- **Backend**: Node.js, Express
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **API**: CoinGecko API for cryptocurrency data
- **Features**: Web Notifications API, Local Storage

## Installation

1. Clone the repository:
```bash
git clone https://github.com/FairchildX/PriceTracker.git
cd PriceTracker
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your preferred settings
```

4. Start the application:
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

5. Open your browser and visit `http://localhost:3000`

## Usage

### Adding Cryptocurrencies
1. Enter a cryptocurrency symbol (e.g., `BTC`, `ETH`, `ADA`)
2. Optionally set a price alert value
3. Click "Add" to start tracking

### Setting Price Alerts
- When adding a cryptocurrency, enter your target price in the alert field
- You'll receive browser notifications when the price crosses your target
- Alert indicators are shown next to tracked cryptocurrencies

### Managing Your List
- Click "Remove" to stop tracking a cryptocurrency
- Your tracking list is automatically saved locally

## Configuration

The application can be configured using environment variables:

```env
PORT=3000                           # Server port
COINGECKO_API_BASE=https://...      # CoinGecko API base URL
PRICE_UPDATE_INTERVAL=30000         # Update interval in milliseconds
```

## API Endpoints

- `GET /api/price/:symbol` - Get current price for a cryptocurrency
- `GET /api/prices?symbols=btc,eth` - Get prices for multiple cryptocurrencies

## Contributing

Feel free to submit issues and pull requests!

## License

MIT