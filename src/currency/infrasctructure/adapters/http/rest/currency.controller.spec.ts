import { Test, TestingModule } from '@nestjs/testing';

import { ConvertCurrencyUseCase } from '../../../../application/use-cases/convert-currency.usecase';
import { GetExchangeRateUseCase } from '../../../../application/use-cases/get-exchange-rate.usecase';
import {
  ConvertCurrencyRequestBody,
  ConvertCurrencyResponse,
} from '../../../../interfaces/dto/controller/convert-currency.dto';
import {
  GetExchangeRateRequestBody,
  GetExchangeRateResponseBody,
} from '../../../../interfaces/dto/controller/get-exchange-rate.dto';
import { CurrencyController } from './currency.controller';

describe('CurrencyController', () => {
  let controller: CurrencyController;
  let getExchangeRateUseCase: GetExchangeRateUseCase;
  let convertCurrencyUseCase: ConvertCurrencyUseCase;

  const mockGetRateResult = 1.2;
  const mockConvertedAmount = 100;

  const getExchangeRateUseCaseMock = {
    execute: jest.fn().mockResolvedValue(mockGetRateResult),
  };

  const convertCurrencyUseCaseMock = {
    execute: jest.fn().mockResolvedValue(mockConvertedAmount),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurrencyController],
      providers: [
        {
          provide: GetExchangeRateUseCase,
          useValue: getExchangeRateUseCaseMock,
        },
        {
          provide: ConvertCurrencyUseCase,
          useValue: convertCurrencyUseCaseMock,
        },
      ],
    }).compile();

    controller = module.get<CurrencyController>(CurrencyController);
    getExchangeRateUseCase = module.get<GetExchangeRateUseCase>(
      GetExchangeRateUseCase,
    );
    convertCurrencyUseCase = module.get<ConvertCurrencyUseCase>(
      ConvertCurrencyUseCase,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return exchange rate', async () => {
    const query = new GetExchangeRateRequestBody();
    query.from = 'USD';
    query.to = 'EUR';
    const expectedResponse = new GetExchangeRateResponseBody();
    expectedResponse.rate = mockGetRateResult;

    const result = await controller.getRate(query);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(getExchangeRateUseCase.execute).toHaveBeenCalledWith({
      from: 'USD',
      to: 'EUR',
    });
    expect(result).toEqual(expectedResponse);
  });

  it('should return converted currency amount', async () => {
    const query = new ConvertCurrencyRequestBody();
    query.from = 'USD';
    query.to = 'EUR';
    query.amount = 100;

    const expectedResponse = new ConvertCurrencyResponse();
    expectedResponse.amount = mockConvertedAmount;

    const result = await controller.convertCurrency(query);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(convertCurrencyUseCase.execute).toHaveBeenCalledWith({
      from: 'USD',
      to: 'EUR',
      amount: 100,
    });
    expect(result).toEqual(expectedResponse);
  });
});
