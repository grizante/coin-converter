import { Module } from '@nestjs/common';

import { CurrencyController } from './infrasctructure/adapters/http/rest/currency.controller';
import { ConvertCurrencyUseCase } from './application/use-cases/conver-currency.usecase';
import { CurrencyGrpcController } from './infrasctructure/adapters/http/grpc/currency.grpc.controller';
import { CurrencyLayerClient } from './infrasctructure/adapters/clients/currency-layer.client';
import { ExchangeCacheRepository } from './infrasctructure/persistence/exchange-cache.repository';
import { GetExchangeRateUseCase } from './application/use-cases/get-exchange-rate.usecase';
import { IExchangeRateProviderToken } from './domain/ports/exchange.provider.interface';
import { CurrencyGateway } from './infrasctructure/adapters/http/ws/currency.gateway';

@Module({
  imports: [],
  controllers: [CurrencyController, CurrencyGrpcController],
  providers: [
    ConvertCurrencyUseCase,
    GetExchangeRateUseCase,
    { provide: IExchangeRateProviderToken, useClass: CurrencyLayerClient },
    ExchangeCacheRepository,
    CurrencyGateway,
  ],
  exports: [GetExchangeRateUseCase, CurrencyGateway],
})
export class CurrencyModule {}
