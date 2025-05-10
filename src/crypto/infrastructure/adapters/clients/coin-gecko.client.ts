import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CoinGeckoCoinsListWithMarketDataResponse } from '../../../domain/models/coin-gecko.response';
import { ICryptoProvider } from '../../../domain/ports/crypto.provider.interface';

@Injectable()
export class CoinGeckoClient implements ICryptoProvider {
  private readonly endpoint: string;
  private readonly accessKey: string;

  constructor(private readonly config: ConfigService) {
    this.accessKey = this.config.getOrThrow<string>('coinGecko.accessKey');
    this.endpoint = this.config.getOrThrow<string>('coinGecko.endpoint');
  }

  async getTopTenCryptos(currency: string = 'usd'): Promise<
    {
      symbol: string;
      name: string;
      current_price: number;
      market_cap: number;
      market_cap_rank: number;
    }[]
  > {
    const response = await fetch(
      `${this.endpoint}/coins/markets?order=market_cap_desc&vs_currency=${currency}&per_page=10&page=1&sparkline=false`,
      {
        headers: {
          accept: 'application/json',
          'x-cg-demo-api-key': this.accessKey,
        },
      },
    );

    return (await response.json()) as CoinGeckoCoinsListWithMarketDataResponse[];
  }
}
