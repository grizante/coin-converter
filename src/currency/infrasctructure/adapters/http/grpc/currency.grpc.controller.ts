import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { mergeMap, Observable, timer } from 'rxjs';

import { ConvertCurrencyUseCase } from '../../../../application/use-cases/convert-currency.usecase';
import { GetExchangeRateUseCase } from '../../../../application/use-cases/get-exchange-rate.usecase';

@Controller()
export class CurrencyGrpcController {
  constructor(
    private readonly getRateUseCase: GetExchangeRateUseCase,
    private readonly convertCurrencyUseCase: ConvertCurrencyUseCase,
  ) {}

  @GrpcMethod('CurrencyService', 'StreamRate')
  streamRate(data: {
    from: string;
    to: string;
  }): Observable<{ rate: number; timestamp: string }> {
    return timer(0, 60_000).pipe(
      mergeMap(async () => {
        const rate = await this.getRateUseCase.execute(data);
        return {
          rate,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }

  @GrpcMethod('CurrencyService', 'StreamConvertCurrency')
  convertCurrency(data: {
    from: string;
    to: string;
    amount: number;
  }): Observable<{ amount: number; timestamp: string }> {
    return timer(0, 60_000).pipe(
      mergeMap(async () => {
        const amount = await this.convertCurrencyUseCase.execute(data);
        console.log(amount);
        return {
          amount,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
