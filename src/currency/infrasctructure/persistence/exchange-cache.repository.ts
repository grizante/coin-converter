import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis/built/Redis';

@Injectable()
export class ExchangeCacheRepository {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  private buildKey(from: string, to: string): string {
    return `rate:${from}:${to}`;
  }

  async getRate(from: string, to: string): Promise<number | null> {
    const cached = await this.redis.get(this.buildKey(from, to));
    return cached ? parseFloat(cached) : null;
  }

  async setRate(
    from: string,
    to: string,
    rate: number,
    ttl = 60,
  ): Promise<void> {
    await this.redis.set(this.buildKey(from, to), rate.toString(), 'EX', ttl);
  }
}
