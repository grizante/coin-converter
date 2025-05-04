import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { interval, mergeMap, Observable } from 'rxjs';

import { GetExchangeRateUseCase } from '../../../../application/use-cases/get-exchange-rate.usecase';

@Controller()
export class CurrencyGrpcController {
  constructor(private readonly getRateUseCase: GetExchangeRateUseCase) {}

  @GrpcMethod('CurrencyService', 'StreamRate')
  streamRate(data: {
    from: string;
    to: string;
  }): Observable<{ rate: number; timestamp: string }> {
    return interval(60_000).pipe(
      mergeMap(async () => {
        const rate = await this.getRateUseCase.execute(data);
        return {
          rate,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
