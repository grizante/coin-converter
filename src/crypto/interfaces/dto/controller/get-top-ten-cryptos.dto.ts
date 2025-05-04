import { ApiProperty } from '@nestjs/swagger';

import { CoinGeckoCoinsListWithMarketDataResponse } from '../../../domain/models/coin-gecko.response';

class GetTopTenCryptosCryptoItem {
  @ApiProperty({
    type: String,
    example: 'BTC',
  })
  symbol: string;

  @ApiProperty({
    type: String,
    example: 'Bitcoin',
  })
  name: string;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  current_price: number;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  market_cap: number;
}

export class GetTopTenCryptosResponseBody {
  @ApiProperty({
    type: [GetTopTenCryptosCryptoItem],
    example: [
      {
        symbol: 'BTC',
        name: 'Bitcoin',
        current_price: 1,
        market_cap: 1,
      },
    ],
  })
  cryptos: GetTopTenCryptosCryptoItem[];

  @ApiProperty({
    type: String,
    example: '2022-01-01T00:00:00.000Z',
  })
  last_updated: string;

  static fromCoinGeckoCoinsListWithMarketDataResponse(
    cryptos: CoinGeckoCoinsListWithMarketDataResponse[],
  ): GetTopTenCryptosResponseBody {
    return {
      cryptos: cryptos.map((crypto) => ({
        symbol: crypto.symbol,
        name: crypto.name,
        current_price: crypto.current_price,
        market_cap: crypto.market_cap,
      })),
      last_updated: new Date().toISOString(),
    };
  }
}
