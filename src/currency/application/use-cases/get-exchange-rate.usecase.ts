import { Inject, Injectable } from '@nestjs/common';

import {
  IExchangeRateProvider,
  IExchangeRateProviderToken,
} from '../../domain/ports/exchange.provider.interface';
import { GetExchangeRateInput } from '../../interfaces/dto/service/get-exchange-rate.dto';

@Injectable()
export class GetExchangeRateUseCase {
  constructor(
    @Inject(IExchangeRateProviderToken)
    private exchangeProvider: IExchangeRateProvider,
  ) {}

  async execute(input: GetExchangeRateInput): Promise<number> {
    const { from, to } = input;
    return this.exchangeProvider.getRate(from, to);
  }
}
