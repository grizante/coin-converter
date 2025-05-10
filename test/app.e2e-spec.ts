import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { App } from 'supertest/types';

import { ConfigModule } from '@nestjs/config';

import config from '../src/config/config';
import { CryptoModule } from '../src/crypto/crypto.module';
import { CurrencyModule } from '../src/currency/currency.module';
import { AppModule } from './../src/app.module';

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

  it('/currency/rate (GET) should return exchange rate', async () => {
    const response = await request(app.getHttpServer())
      .get('/currency/rate')
      .query({
        from: 'USD',
        to: 'EUR',
      })
      .expect(HttpStatus.OK);

    expect(response.body).toHaveProperty('rate');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(typeof response.body.rate).toBe('number');
  });

  it('/crypto (GET) should return top 10 cryptos', async () => {
    const response = await request(app.getHttpServer())
      .get('/crypto')
      .query({
        currency: 'USD',
      })
      .expect(HttpStatus.OK);

    expect(response.body).toHaveProperty('cryptos');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(Array.isArray(response.body.cryptos)).toBe(true);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(response.body.cryptos.length).toBe(10);
  });
});
