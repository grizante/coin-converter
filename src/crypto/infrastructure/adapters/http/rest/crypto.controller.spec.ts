import { Test, TestingModule } from '@nestjs/testing';
import { CryptoController } from './crypto.controller';
import { GetTopTenCryptosUseCase } from '../../../../application/use-cases/get-top-cryptos.usecase';
import { GetTopTenCryptosResponseBody } from '../../../../interfaces/dto/controller/get-top-ten-cryptos.dto';

describe('CryptoController', () => {
  let controller: CryptoController;
  let useCaseMock: { execute: jest.Mock };

  const mockCryptoData = [
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
    const result = await controller.getTopTenCryptos();

    expect(useCaseMock.execute).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockFormattedResponse);
  });
});
