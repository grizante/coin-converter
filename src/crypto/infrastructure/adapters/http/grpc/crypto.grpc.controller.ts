import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { mergeMap, Observable, timer } from 'rxjs';

import { GetTopTenCryptosUseCase } from '../../../../application/use-cases/get-top-cryptos.usecase';

@Controller()
export class CryptoGrpcController {
  constructor(
    private readonly getTopTenCryptosUseCase: GetTopTenCryptosUseCase,
  ) {}

  @GrpcMethod('CryptoService', 'StreamGetTopCryptos')
  streamGetTopTenCryptos(data: { currency?: string }): Observable<{
    cryptos: any[];
    last_updated: string;
  }> {
    return timer(0, 60_000).pipe(
      mergeMap(async () => {
        const cryptos = await this.getTopTenCryptosUseCase.execute(data);
        return {
          cryptos: cryptos.map((crypto) => ({
            symbol: crypto.symbol,
            name: crypto.name,
            current_price: crypto.current_price,
            market_cap: crypto.market_cap,
            market_cap_rank: crypto.market_cap_rank,
          })),
          last_updated: new Date().toISOString(),
        };
      }),
    );
  }
}
