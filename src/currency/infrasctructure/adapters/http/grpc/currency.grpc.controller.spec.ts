import { Test, TestingModule } from '@nestjs/testing';
import { take } from 'rxjs';

import { CurrencyGrpcController } from './currency.grpc.controller';
import { GetExchangeRateUseCase } from '../../../../application/use-cases/get-exchange-rate.usecase';
import { ConvertCurrencyUseCase } from '../../../../application/use-cases/convert-currency.usecase';

describe('CurrencyGrpcController', () => {
  let controller: CurrencyGrpcController;
  let getRateUseCaseMock: { execute: jest.Mock };
  let convertCurrencyUseCaseMock: { execute: jest.Mock };

  beforeEach(async () => {
    getRateUseCaseMock = {
      execute: jest.fn().mockResolvedValue(1.23),
    };

    convertCurrencyUseCaseMock = {
      execute: jest.fn().mockResolvedValue(123.45),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurrencyGrpcController],
      providers: [
        { provide: GetExchangeRateUseCase, useValue: getRateUseCaseMock },
        {
          provide: ConvertCurrencyUseCase,
          useValue: convertCurrencyUseCaseMock,
        },
      ],
    }).compile();

    controller = module.get<CurrencyGrpcController>(CurrencyGrpcController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should stream exchange rate data', (done) => {
    const stream$ = controller.streamRate({ from: 'USD', to: 'EUR' });

    stream$.pipe(take(1)).subscribe((data) => {
      expect(getRateUseCaseMock.execute).toHaveBeenCalledWith({
        from: 'USD',
        to: 'EUR',
      });
      expect(data).toHaveProperty('rate', 1.23);
      expect(typeof data.timestamp).toBe('string');
      done();
    });
  });

  it('should stream converted currency data', (done) => {
    const stream$ = controller.convertCurrency({
      from: 'USD',
      to: 'EUR',
      amount: 100,
    });

    stream$.pipe(take(1)).subscribe((data) => {
      expect(convertCurrencyUseCaseMock.execute).toHaveBeenCalledWith({
        from: 'USD',
        to: 'EUR',
        amount: 100,
      });
      expect(data).toHaveProperty('amount', 123.45);
      expect(typeof data.timestamp).toBe('string');
      done();
    });
  });
});
