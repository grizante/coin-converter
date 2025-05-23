import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  CurrencyLayerConvertResponse,
  CurrencyLayerLiveResponse,
} from '../../../domain/models/currency-layer.response';
import { IExchangeRateProvider } from '../../../domain/ports/exchange.provider.interface';

@Injectable()
export class CurrencyLayerClient implements IExchangeRateProvider {
  private readonly endpoint: string;
  private readonly accessKey: string;

  constructor(private readonly config: ConfigService) {
    this.accessKey = this.config.getOrThrow<string>('currencyLayer.accessKey');
    this.endpoint = this.config.getOrThrow<string>('currencyLayer.endpoint');
  }

  async getRate(
    from: string,
    to: string,
  ): Promise<{ rate: number; success: boolean }> {
    const response = await fetch(
      `${this.endpoint}/live?access_key=${this.accessKey}&from=${from}&to=${to}&format=1`,
    );

    const data = (await response.json()) as CurrencyLayerLiveResponse;

    return {
      rate: data.quotes ? data.quotes[`${from}${to}`] : 0,
      success: data.success,
    };
  }

  async convertCurrency(
    from: string,
    to: string,
    amount: number,
  ): Promise<number> {
    const response = await fetch(
      `${this.endpoint}/convert?access_key=${this.accessKey}&from=${from}&to=${to}&amount=${amount}&format=1`,
    );

    const data = (await response.json()) as CurrencyLayerConvertResponse;

    return data.result;
  }
}
