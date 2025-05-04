import { Inject, Injectable } from '@nestjs/common';

import {
  ICryptoProvider,
  ICryptoProviderToken,
} from '../../domain/ports/crypto.provider.interface';
import { CryptoCacheRepository } from '../../infrastructure/persistence/crypto-cache.repository';
import { CoinGeckoCoinsListWithMarketDataResponse } from '../../domain/models/coin-gecko.response';

@Injectable()
export class GetTopTenCryptosUseCase {
  constructor(
    @Inject(ICryptoProviderToken)
    private cryptoProvider: ICryptoProvider,
    private readonly cryptoCache: CryptoCacheRepository,
  ) {}

  async execute(): Promise<CoinGeckoCoinsListWithMarketDataResponse[]> {
    const cached = await this.cryptoCache.getTopCryptos();

    if (cached) {
      return cached;
    }

    const cryptos = await this.cryptoProvider.getTopTenCryptos();
    await this.cryptoCache.cacheTopCryptos(cryptos);

    return cryptos;
  }
}
