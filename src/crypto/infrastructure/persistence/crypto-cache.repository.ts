import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis/built/Redis';
import { CoinGeckoCoinsListWithMarketDataResponse } from '../../domain/models/coin-gecko.response';

@Injectable()
export class CryptoCacheRepository {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  private buildTopListKey(currency?: string): string {
    return `crypto:top:${currency}`;
  }

  async getTopCryptos(
    currency?: string,
  ): Promise<CoinGeckoCoinsListWithMarketDataResponse[] | null> {
    const cached = await this.redis.get(this.buildTopListKey(currency));
    return cached
      ? (JSON.parse(cached) as CoinGeckoCoinsListWithMarketDataResponse[])
      : null;
  }

  async cacheTopCryptos(
    cryptos: CoinGeckoCoinsListWithMarketDataResponse[],
    currency?: string,
  ): Promise<void> {
    await this.redis.set(
      this.buildTopListKey(currency),
      JSON.stringify(cryptos),
      'EX',
      60,
    );
  }
}
