import { Test, TestingModule } from '@nestjs/testing';

import { ICryptoProviderToken } from '../../domain/ports/crypto.provider.interface';
import { CryptoCacheRepository } from '../persistence/crypto-cache.repository';
import { TasksService } from './crypto-sync.task';

const mockCryptos = [
  {
    symbol: 'btc',
    name: 'Bitcoin',
    current_price: 50000,
    market_cap: 1000000000,
  },
  {
    symbol: 'eth',
    name: 'Ethereum',
    current_price: 4000,
    market_cap: 500000000,
  },
];

describe('TasksService', () => {
  let service: TasksService;
  let cryptoProviderMock: { getTopTenCryptos: jest.Mock };
  let cryptoCacheMock: { cacheTopCryptos: jest.Mock };

  beforeEach(async () => {
    cryptoProviderMock = {
      getTopTenCryptos: jest.fn().mockResolvedValue(mockCryptos),
    };

    cryptoCacheMock = {
      cacheTopCryptos: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: ICryptoProviderToken, useValue: cryptoProviderMock },
        { provide: CryptoCacheRepository, useValue: cryptoCacheMock },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should sync top cryptos and cache them at the interval', async () => {
    await service.syncTopCryptos();

    expect(cryptoProviderMock.getTopTenCryptos).toHaveBeenCalledTimes(1);

    expect(cryptoCacheMock.cacheTopCryptos).toHaveBeenCalledWith(mockCryptos);
  });

  it('should call the syncTopCryptos method every 60 seconds', async () => {
    jest.useFakeTimers();
    const syncTopCryptosSpy = jest.spyOn(service, 'syncTopCryptos');

    service.syncTopCryptos();
    expect(syncTopCryptosSpy).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(60_000);
    await service.syncTopCryptos();
    expect(syncTopCryptosSpy).toHaveBeenCalledTimes(2);

    jest.useRealTimers();
  });
});
