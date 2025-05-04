import { Controller } from '@nestjs/common';

import { GetTopTenCryptosUseCase } from '../../../../application/use-cases/get-top-cryptos.usecase';
import { GrpcMethod } from '@nestjs/microservices';
import { mergeMap, Observable, timer } from 'rxjs';

@Controller()
export class CryptoGrpcController {
  constructor(
    private readonly getTopTenCryptosUseCase: GetTopTenCryptosUseCase,
  ) {}

  @GrpcMethod('CryptoService', 'StreamGetTopCryptos')
  streamGetTopTenCryptos(): Observable<{
    cryptos: any[];
    last_updated: string;
  }> {
    return timer(0, 60_000).pipe(
      mergeMap(async () => {
        const cryptos = await this.getTopTenCryptosUseCase.execute();
        return {
          cryptos: cryptos.map((crypto) => ({
            symbol: crypto.symbol,
            name: crypto.name,
            current_price: crypto.current_price,
            market_cap: crypto.market_cap,
          })),
          last_updated: new Date().toISOString(),
        };
      }),
    );
  }
}
