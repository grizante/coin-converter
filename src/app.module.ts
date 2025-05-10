import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { RedisModule } from '@nestjs-modules/ioredis';
import config from './config/config';

import { CryptoModule } from './crypto/crypto.module';
import { CurrencyModule } from './currency/currency.module';

@Module({
  imports: [
    CurrencyModule,
    CryptoModule,
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    RedisModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        type: 'single',
        options: {
          host: config.get<string>('redis.host') || 'localhost',
          port: config.get<number>('redis.port') || 6379,
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
