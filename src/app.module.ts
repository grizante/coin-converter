import { Module } from '@nestjs/common';

import config from './config/config';

import { CurrencyModule } from './currency/currency.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    CurrencyModule,
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
