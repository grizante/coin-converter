# 🪙 Coin Converter API

A scalable, modular currency and crypto service built with NestJS. Supports REST, gRPC, and WebSocket transport layers. Real-time conversion and exchange rate updates powered by Redis caching and background tasks.

---

## 🚀 Features

- 💱 **Fiat Currency Conversion** using CurrencyLayer
- 🪙 **Top 10 Cryptos** fetched from CoinGecko
- 🔁 **Live Streams** over WebSocket for rates and conversions
- 🧾 **REST, gRPC, and WebSocket** APIs available
- ⚙️ **Redis** for caching responses
- 🧠 **Hexagonal Architecture**
- 🔧 Swagger & ReDoc documentation
- 🐳 Dockerized setup with Redis

---

## 🧱 Project Structure

```
src/
├── app.module.ts
├── config/                    # Environment & config files
├── core/grpc/                 # gRPC server setup
├── crypto/                    # Crypto domain (CoinGecko)
├── currency/                  # Currency domain (CurrencyLayer)
├── main.ts                    # Entry point
```

### Modular Hexagonal Layers:

- `domain`: models and interface ports
- `application`: use cases
- `infrastructure`: adapters, HTTP/GRPC/WS controllers, cache
- `interfaces`: DTOs and proto definitions

---

## 🐳 Docker Setup

### docker-compose.yml

```yaml
version: '3.8'

services:
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --save 60 1 --loglevel warning

  app:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - redis
    volumes:
      - .:/usr/src/app
      - /usr/src/app/node_modules
    env_file:
      - .env
    command: npm run start:prod

volumes:
  redis_data:
```

### Dockerfile

```Dockerfile
FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main"]
```

---

## 🏁 Running Locally

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Services

```bash
docker-compose up --build
```

App runs on: [http://localhost:3000](http://localhost:3000)

---

## 🧬 API Documentation

### REST (Swagger + ReDoc)

- OpenAPI JSON: [GET /docs/openapi.json](http://localhost:3000/docs/openapi.json)
- ReDoc UI: [http://localhost:3000/docs](http://localhost:3000/docs)

---

## 📡 API Endpoints

### 🔹 REST Endpoints

| Method | Path                  | Description                          |
|--------|-----------------------|--------------------------------------|
| POST   | `/crypto/top-ten`     | Get top 10 cryptocurrencies          |
| POST   | `/currency/convert`   | Convert a specific currency amount   |
| POST   | `/currency/rate`      | Get exchange rate between two units  |

### 🔸 WebSocket Events

- `startRateStream` → emits `rateUpdate`
- `startConvertCurrencyStream` → emits `amountUpdate`
- `cryptosUpdate` emitted periodically (from background task)

### 🟣 gRPC Services

- `CryptoService.StreamGetTopCryptos`
- `CurrencyService.StreamRate`
- `CurrencyService.StreamConvertCurrency`

---

## 🧠 Background Task

Runs every 60 seconds to sync top crypto data:

```ts
@Interval(60_000)
async syncTopCryptos() {
  const cryptos = await this.cryptoProvider.getTopTenCryptos();
  await this.cryptoCache.cacheTopCryptos(cryptos);
}
```

This keeps crypto data fresh for WebSocket and gRPC consumers.

---

## 🧪 Testing

Uses `jest` for unit, integration, and end-to-end (E2E) tests. Coverage includes:

- Use Cases  
- Gateways (including WebSocket events like `getTopTenCryptos`)  
- REST & gRPC Controllers  
- External API Clients

### Automated Tests

Run all unit and integration tests with:

```bash
npm run test
```

### End-to-End (E2E) Tests

#### 1. NestJS E2E Tests

Uses the official Nest testing module to verify REST endpoint behavior in a real application context.

Run:

```bash
npm run test:e2e
```

#### 2. WebSocket E2E Test (Manual)

You can manually test the WebSocket gateway using a simple client script:

```bash
node test/ws/test-client.js
```

> This script simulates a real client connecting to the WebSocket server and listening for emitted events. Useful for manual verification and debugging of gateway behavior.


---

## ✅ Environment Variables

You can configure your app via `.env`:

```env
PORT=3000
CURRENCYLAYER_API_KEY=your_key_here # change to redis if you're about to use it on docker 
REDIS_HOST=localhost
REDIS_PORT=6379
```

---

## 📈 Suggested Improvements

- [ ] Add authentication (e.g., JWT) for secured routes and sockets.
- [ ] Expose Prometheus-compatible metrics.
- [ ] Retry logic for upstream providers.
- [ ] CI/CD integration (e.g., GitHub Actions).
- [ ] Persist historical exchange and conversion logs.
- [ ] Error handling.
- [ ] Document GRPC and Websocket endpoints.
- [ ] Validate GRPC and Websocket bequest bodies.
---

## 🧾 License

MIT

---

## 🤝 Contributing

Open issues, submit PRs, and help improve real-time finance APIs!

````
