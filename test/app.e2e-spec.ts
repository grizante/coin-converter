import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { App } from 'supertest/types';

import { ConfigModule } from '@nestjs/config';

import config from '../src/config/config';
import { CurrencyModule } from '../src/currency/currency.module';
import { AppModule } from './../src/app.module';
import { CryptoModule } from '../src/crypto/crypto.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let moduleFixture: TestingModule;

  beforeEach(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [config],
        }),
        AppModule,
        CurrencyModule,
        CryptoModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await moduleFixture.close();
    await app.close();
  });

  it('/currency/convert (POST) should convert currency', async () => {
    const response = await request(app.getHttpServer())
      .get('/currency/convert')
      .query({
        from: 'USD',
        to: 'EUR',
        amount: 100,
      })
      .expect(HttpStatus.OK);

    expect(response.body).toHaveProperty('amount');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(typeof response.body.amount).toBe('number');
  });
});
