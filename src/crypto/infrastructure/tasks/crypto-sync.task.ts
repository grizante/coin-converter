import { Inject, Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';

import {
  ICryptoProvider,
  ICryptoProviderToken,
} from '../../domain/ports/crypto.provider.interface';
import { CryptoCacheRepository } from '../persistence/crypto-cache.repository';

@Injectable()
export class TasksService {
  constructor(
    @Inject(ICryptoProviderToken)
    private cryptoProvider: ICryptoProvider,
    private readonly cryptoCache: CryptoCacheRepository,
  ) {}

  @Interval(60_000)
  async syncTopCryptos() {
    const cryptos = await this.cryptoProvider.getTopTenCryptos();
    await this.cryptoCache.cacheTopCryptos(cryptos);
  }
}
