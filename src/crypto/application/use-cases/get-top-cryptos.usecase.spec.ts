import { Test, TestingModule } from '@nestjs/testing';

import { CoinGeckoCoinsListWithMarketDataResponse } from '../../domain/models/coin-gecko.response';
import { ICryptoProviderToken } from '../../domain/ports/crypto.provider.interface';
import { CryptoCacheRepository } from '../../infrastructure/persistence/crypto-cache.repository';
import { GetTopTenCryptosUseCase } from './get-top-cryptos.usecase';

describe('GetTopTenCryptosUseCase', () => {
  let useCase: GetTopTenCryptosUseCase;

  const mockCryptoData: CoinGeckoCoinsListWithMarketDataResponse[] = [
    { name: 'Bitcoin', symbol: 'btc', market_cap: 1, current_price: 1 },
    { name: 'Ethereum', symbol: 'eth', market_cap: 2, current_price: 2 },
  ];

  const cryptoProviderMock = {
    getTopTenCryptos: jest.fn(),
  };

  const cacheRepoMock = {
    getTopCryptos: jest.fn(),
    cacheTopCryptos: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetTopTenCryptosUseCase,
        { provide: ICryptoProviderToken, useValue: cryptoProviderMock },
        { provide: CryptoCacheRepository, useValue: cacheRepoMock },
      ],
    }).compile();

    useCase = module.get(GetTopTenCryptosUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return cached cryptos if available', async () => {
    cacheRepoMock.getTopCryptos.mockResolvedValue(mockCryptoData);

    const result = await useCase.execute();

    expect(cacheRepoMock.getTopCryptos).toHaveBeenCalled();
    expect(cryptoProviderMock.getTopTenCryptos).not.toHaveBeenCalled();
    expect(result).toEqual(mockCryptoData);
  });

  it('should fetch from provider and cache result if cache is empty', async () => {
    cacheRepoMock.getTopCryptos.mockResolvedValue(null);
    cryptoProviderMock.getTopTenCryptos.mockResolvedValue(mockCryptoData);

    const result = await useCase.execute();

    expect(cacheRepoMock.getTopCryptos).toHaveBeenCalled();
    expect(cryptoProviderMock.getTopTenCryptos).toHaveBeenCalled();
    expect(cacheRepoMock.cacheTopCryptos).toHaveBeenCalledWith(mockCryptoData);
    expect(result).toEqual(mockCryptoData);
  });
});
