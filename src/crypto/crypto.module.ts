import { Module } from '@nestjs/common';

import { ScheduleModule } from '@nestjs/schedule';
import { GetTopTenCryptosUseCase } from './application/use-cases/get-top-cryptos.usecase';
import { ICryptoProviderToken } from './domain/ports/crypto.provider.interface';
import { CoinGeckoClient } from './infrastructure/adapters/clients/coin-gecko.client';
import { CryptoGrpcController } from './infrastructure/adapters/http/grpc/crypto.grpc.controller';
import { CryptoController } from './infrastructure/adapters/http/rest/crypto.controller';
import { CryptoGateway } from './infrastructure/adapters/http/ws/crypto.gateway';
import { CryptoCacheRepository } from './infrastructure/persistence/crypto-cache.repository';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [CryptoController, CryptoGrpcController],
  providers: [
    GetTopTenCryptosUseCase,
    { provide: ICryptoProviderToken, useClass: CoinGeckoClient },
    CryptoCacheRepository,
    CryptoGateway,
  ],
})
export class CryptoModule {}
