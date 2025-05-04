# 🪙 Coin Converter

A microservice-based currency and cryptocurrency conversion API using NestJS, Redis caching, gRPC, REST, and WebSockets.

---

## 📦 Features

- 💱 Currency exchange using [CurrencyLayer](https://currencylayer.com/)
- 🪙 Crypto rates via [CoinGecko](https://www.coingecko.com/)
- ⚡ REST, WebSocket, and gRPC interfaces
- 🧠 Redis-based caching
- 🐳 Dockerized for easy deployment

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/coin-converter.git
cd coin-converter
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
# Currency Layer
CURRENCY_LAYER_API_KEY=your_currencylayer_key
CURRENCY_LAYER_API_ENDPOINT=https://api.currencylayer.com

# CoinGecko
COIN_GECKO_API_KEY=your_coingecko_key
COIN_GECKO_API_ENDPOINT=https://api.coingecko.com

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

---

## 🐳 Running with Docker

Build and run the services:

```bash
docker-compose up --build
```

This will:
- Start the NestJS app on `http://localhost:3000`
- Start Redis on `localhost:6379`

---

## ⚙️ Project Structure

```
src/
├── crypto/         # Crypto-specific logic
├── currency/       # Currency conversion logic
├── config/         # Configuration and .env support
├── main.ts         # Entry point
```

---

## 🧪 gRPC Usage

### Proto files

Located in:
```
src/crypto/interfaces/grpc/crypto.proto
src/currency/interfaces/grpc/currency.proto
```

### Example call using `grpcurl`:

```bash
grpcurl -plaintext -d '{"from": "USD", "to": "BRL", "amount": 10}' \
  localhost:50051 currency.CurrencyService/StreamConvertCurrency
```

---

## 📡 REST Endpoints

Once the app is running:

- `GET /currency/convert?from=USD&to=BRL&amount=10`
- `GET /crypto/top-ten` (example)

---

## 📬 WebSocket Support

WebSocket gateways are available at:

```
ws://localhost:3000/currency
ws://localhost:3000/crypto
```

---

## 🧼 Scripts

- `npm run start` - Run in development
- `npm run build` - Build TypeScript
- `npm run start:prod` - Run compiled app

---

## 📃 License

MIT — feel free to use and modify.

---

## 🙋‍♂️ Contributions

PRs and issues are welcome! Please follow conventional commit messages and NestJS best practices.
