import { Test, TestingModule } from '@nestjs/testing';

import { IExchangeRateProviderToken } from '../../domain/ports/exchange.provider.interface';
import { ConvertCurrencyCacheRepository } from '../../infrasctructure/persistence/convert-currency-cache.repository';
import { ConvertCurrencyInput } from '../../interfaces/dto/service/convert-currency.dto';
import { ConvertCurrencyUseCase } from './convert-currency.usecase';

describe('ConvertCurrencyUseCase', () => {
  let useCase: ConvertCurrencyUseCase;

  const mockConversionResult = 100;
  const mockInput: ConvertCurrencyInput = {
    from: 'USD',
    to: 'EUR',
    amount: 1,
  };

  const exchangeProviderMock = {
    convertCurrency: jest.fn(),
  };

  const convertCacheMock = {
    getConversion: jest.fn(),
    setConversion: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConvertCurrencyUseCase,
        { provide: IExchangeRateProviderToken, useValue: exchangeProviderMock },
        { provide: ConvertCurrencyCacheRepository, useValue: convertCacheMock },
      ],
    }).compile();

    useCase = module.get(ConvertCurrencyUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return cached conversion data if available', async () => {
    convertCacheMock.getConversion.mockResolvedValue(mockConversionResult);

    const result = await useCase.execute(mockInput);

    expect(convertCacheMock.getConversion).toHaveBeenCalledWith(
      mockInput.from,
      mockInput.to,
    );
    expect(exchangeProviderMock.convertCurrency).not.toHaveBeenCalled();
    expect(result).toEqual(mockConversionResult);
  });

  it('should fetch from provider and cache result if cache is empty', async () => {
    convertCacheMock.getConversion.mockResolvedValue(null);
    exchangeProviderMock.convertCurrency.mockResolvedValue(
      mockConversionResult,
    );

    const result = await useCase.execute(mockInput);

    expect(convertCacheMock.getConversion).toHaveBeenCalledWith(
      mockInput.from,
      mockInput.to,
    );
    expect(exchangeProviderMock.convertCurrency).toHaveBeenCalledWith(
      mockInput.from,
      mockInput.to,
      mockInput.amount,
    );
    expect(convertCacheMock.setConversion).toHaveBeenCalledWith(
      mockInput.from,
      mockInput.to,
      mockConversionResult,
    );
    expect(result).toEqual(mockConversionResult);
  });

  it('should handle errors if the exchange provider fails', async () => {
    convertCacheMock.getConversion.mockResolvedValue(null);

    exchangeProviderMock.convertCurrency.mockRejectedValue(
      new Error('API error'),
    );

    try {
      await useCase.execute(mockInput);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }

    expect(convertCacheMock.getConversion).toHaveBeenCalledWith(
      mockInput.from,
      mockInput.to,
    );
    expect(exchangeProviderMock.convertCurrency).toHaveBeenCalledWith(
      mockInput.from,
      mockInput.to,
      mockInput.amount,
    );
  });
});
