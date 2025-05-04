import { Module } from '@nestjs/common';

import { ConvertCurrencyUseCase } from './application/use-cases/convert-currency.usecase';
import { GetExchangeRateUseCase } from './application/use-cases/get-exchange-rate.usecase';
import { IExchangeRateProviderToken } from './domain/ports/exchange.provider.interface';
import { CurrencyLayerClient } from './infrasctructure/adapters/clients/currency-layer.client';
import { CurrencyGrpcController } from './infrasctructure/adapters/http/grpc/currency.grpc.controller';
import { CurrencyController } from './infrasctructure/adapters/http/rest/currency.controller';
import { CurrencyGateway } from './infrasctructure/adapters/http/ws/currency.gateway';
import { ConvertCurrencyCacheRepository } from './infrasctructure/persistence/convert-currency-cache.repository';
import { ExchangeCacheRepository } from './infrasctructure/persistence/exchange-cache.repository';

@Module({
  imports: [],
  controllers: [CurrencyController, CurrencyGrpcController],
  providers: [
    ConvertCurrencyUseCase,
    GetExchangeRateUseCase,
    { provide: IExchangeRateProviderToken, useClass: CurrencyLayerClient },
    ExchangeCacheRepository,
    ConvertCurrencyCacheRepository,
    CurrencyGateway,
  ],
  exports: [GetExchangeRateUseCase, CurrencyGateway],
})
export class CurrencyModule {}
