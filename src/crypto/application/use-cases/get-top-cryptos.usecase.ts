import { Inject, Injectable } from '@nestjs/common';

import {
  ICryptoProvider,
  ICryptoProviderToken,
} from '../../domain/ports/crypto.provider.interface';
import { CryptoCacheRepository } from '../../infrastructure/persistence/crypto-cache.repository';
import { CoinGeckoCoinsListWithMarketDataResponse } from '../../domain/models/coin-gecko.response';
import { GetTopTenCryptosInput } from '../../interfaces/dto/service/get-top-ten-cryptos.dto';

@Injectable()
export class GetTopTenCryptosUseCase {
  constructor(
    @Inject(ICryptoProviderToken)
    private cryptoProvider: ICryptoProvider,
    private readonly cryptoCache: CryptoCacheRepository,
  ) {}

  async execute(
    input: GetTopTenCryptosInput,
  ): Promise<CoinGeckoCoinsListWithMarketDataResponse[]> {
    const { currency } = input;

    const cached = await this.cryptoCache.getTopCryptos(currency);

    if (cached) {
      return cached;
    }

    const cryptos = await this.cryptoProvider.getTopTenCryptos(currency);
    await this.cryptoCache.cacheTopCryptos(cryptos, currency);

    return cryptos;
  }
}
