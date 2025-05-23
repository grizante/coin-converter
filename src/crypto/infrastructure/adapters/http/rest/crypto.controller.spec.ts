import { Test, TestingModule } from '@nestjs/testing';

import { GetTopTenCryptosUseCase } from '../../../../application/use-cases/get-top-cryptos.usecase';
import {
  GetTopTenCryptosRequestBody,
  GetTopTenCryptosResponseBody,
} from '../../../../interfaces/dto/controller/get-top-ten-cryptos.dto';
import { CryptoController } from './crypto.controller';

describe('CryptoController', () => {
  let controller: CryptoController;
  let useCaseMock: { execute: jest.Mock };

  const mockCryptoData = [
    {
      symbol: 'btc',
      name: 'Bitcoin',
      current_price: 50000,
      market_cap: 1000000000,
      market_cap_rank: 1,
    },
    {
      symbol: 'eth',
      name: 'Ethereum',
      current_price: 4000,
      market_cap: 500000000,
      market_cap_rank: 2,
    },
  ];

  const mockFormattedResponse = {
    cryptos: mockCryptoData,
    last_updated: '2025-01-01T00:00:00.000Z',
  };

  beforeEach(async () => {
    useCaseMock = {
      execute: jest.fn().mockResolvedValue(mockCryptoData),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CryptoController],
      providers: [{ provide: GetTopTenCryptosUseCase, useValue: useCaseMock }],
    }).compile();

    controller = module.get<CryptoController>(CryptoController);

    jest
      .spyOn(
        GetTopTenCryptosResponseBody,
        'fromCoinGeckoCoinsListWithMarketDataResponse',
      )
      .mockReturnValue(mockFormattedResponse);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return formatted crypto data', async () => {
    const query = new GetTopTenCryptosRequestBody();
    const result = await controller.getTopTenCryptos(query);

    expect(useCaseMock.execute).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockFormattedResponse);
  });
});
