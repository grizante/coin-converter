import { Test, TestingModule } from '@nestjs/testing';

import { IExchangeRateProviderToken } from '../../domain/ports/exchange.provider.interface';
import { ExchangeCacheRepository } from '../../infrasctructure/persistence/exchange-cache.repository';
import { GetExchangeRateInput } from '../../interfaces/dto/service/get-exchange-rate.dto';
import { GetExchangeRateUseCase } from './get-exchange-rate.usecase';

describe('GetExchangeRateUseCase', () => {
  let useCase: GetExchangeRateUseCase;

  const mockRate = 1.2;
  const mockInput: GetExchangeRateInput = {
    from: 'USD',
    to: 'EUR',
  };

  const exchangeProviderMock = {
    getRate: jest.fn(),
  };

  const exchangeCacheMock = {
    getRate: jest.fn(),
    setRate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetExchangeRateUseCase,
        { provide: IExchangeRateProviderToken, useValue: exchangeProviderMock },
        { provide: ExchangeCacheRepository, useValue: exchangeCacheMock },
      ],
    }).compile();

    useCase = module.get(GetExchangeRateUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return cached rate if available', async () => {
    exchangeCacheMock.getRate.mockResolvedValue(mockRate);

    const result = await useCase.execute(mockInput);

    expect(exchangeCacheMock.getRate).toHaveBeenCalledWith(
      mockInput.from,
      mockInput.to,
    );
    expect(exchangeProviderMock.getRate).not.toHaveBeenCalled();
    expect(result).toEqual(mockRate);
  });

  it('should handle errors if the exchange provider fails', async () => {
    exchangeCacheMock.getRate.mockResolvedValue(null);
    exchangeProviderMock.getRate.mockRejectedValue(new Error('API error'));

    try {
      await useCase.execute(mockInput);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }

    expect(exchangeCacheMock.getRate).toHaveBeenCalledWith(
      mockInput.from,
      mockInput.to,
    );
    expect(exchangeProviderMock.getRate).toHaveBeenCalledWith(
      mockInput.from,
      mockInput.to,
    );
  });
});
