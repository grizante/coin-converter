import { Inject, Injectable } from '@nestjs/common';

import {
  IExchangeRateProvider,
  IExchangeRateProviderToken,
} from '../../domain/ports/exchange.provider.interface';
import { ConvertCurrencyCacheRepository } from '../../infrasctructure/persistence/convert-currency-cache.repository';
import { ConvertCurrencyInput } from '../../interfaces/dto/service/convert-currency.dto';

@Injectable()
export class ConvertCurrencyUseCase {
  constructor(
    @Inject(IExchangeRateProviderToken)
    private exchangeProvider: IExchangeRateProvider,
    private readonly convertCache: ConvertCurrencyCacheRepository,
  ) {}

  async execute(input: ConvertCurrencyInput): Promise<number> {
    const cached = await this.convertCache.getConversion(input.from, input.to);

    if (cached) {
      return cached;
    }

    const { from, to, amount } = input;
    const conversion = await this.exchangeProvider.convertCurrency(
      from,
      to,
      amount,
    );
    await this.convertCache.setConversion(from, to, conversion);

    return conversion;
  }
}
