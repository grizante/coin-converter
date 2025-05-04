import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { CoinGeckoCoinsListWithMarketDataResponse } from '../../domain/models/coin-gecko.response';
import Redis from 'ioredis/built/Redis';

@Injectable()
export class CryptoCacheRepository {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  private buildTopListKey(): string {
    return `crypto:top:all`;
  }

  async getTopCryptos(): Promise<
    CoinGeckoCoinsListWithMarketDataResponse[] | null
  > {
    const cached = await this.redis.get(this.buildTopListKey());
    return cached
      ? (JSON.parse(cached) as CoinGeckoCoinsListWithMarketDataResponse[])
      : null;
  }

  async cacheTopCryptos(
    cryptos: CoinGeckoCoinsListWithMarketDataResponse[],
  ): Promise<void> {
    await this.redis.set(
      this.buildTopListKey(),
      JSON.stringify(cryptos),
      'EX',
      60,
    );
  }
}
