import { Inject, Injectable } from '@nestjs/common';

import {
  IExchangeRateProvider,
  IExchangeRateProviderToken,
} from '../../domain/ports/exchange.provider.interface';
import { GetExchangeRateInput } from '../../interfaces/dto/service/get-exchange-rate.dto';
import { ExchangeCacheRepository } from '../../infrasctructure/persistence/exchange-cache.repository';

@Injectable()
export class GetExchangeRateUseCase {
  constructor(
    @Inject(IExchangeRateProviderToken)
    private exchangeProvider: IExchangeRateProvider,
    private readonly exchangeCache: ExchangeCacheRepository,
  ) {}

  async execute(input: GetExchangeRateInput): Promise<number> {
    const cached = await this.exchangeCache.getRate(input.from, input.to);

    if (cached) {
      return cached;
    }

    const { from, to } = input;
    const rate = await this.exchangeProvider.getRate(from, to);
    await this.exchangeCache.setRate(from, to, rate);

    return rate;
  }
}
