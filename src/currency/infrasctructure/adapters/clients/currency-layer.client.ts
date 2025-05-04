import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CurrencyLayerLiveResponse } from '../../../domain/models/currency-layer.response';
import { IExchangeRateProvider } from '../../../domain/ports/exchange.provider.interface';

@Injectable()
export class CurrencyLayerClient implements IExchangeRateProvider {
  private readonly endpoint: string;
  private readonly accessKey: string;

  constructor(private readonly config: ConfigService) {
    this.accessKey = this.config.getOrThrow<string>('currencyLayer.accessKey');
    this.endpoint = this.config.getOrThrow<string>('currencyLayer.endpoint');
  }

  async getRate(from: string, to: string): Promise<number> {
    const response = await fetch(
      `${this.endpoint}?access_key=${this.accessKey}&from=${from}&to=${to}&amount=1&format=1`,
    );

    const data = (await response.json()) as CurrencyLayerLiveResponse;

    if (!data.success) {
      throw new InternalServerErrorException('CurrencyLayer API error');
    }

    return data.quotes[`${from}${to}`];
  }
}
