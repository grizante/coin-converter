import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

import { CoinGeckoClient } from './coin-gecko.client';

const mockConfig = {
  getOrThrow: jest.fn(),
};

describe('CoinGeckoClient', () => {
  let client: CoinGeckoClient;

  const mockResponse = [
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

  beforeEach(async () => {
    mockConfig.getOrThrow = jest.fn().mockImplementation((key: string) => {
      if (key === 'coinGecko.accessKey') return 'test-access-key';
      if (key === 'coinGecko.endpoint')
        return 'https://api.coingecko.com/api/v3';
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoinGeckoClient,
        { provide: ConfigService, useValue: mockConfig },
      ],
    }).compile();

    client = module.get<CoinGeckoClient>(CoinGeckoClient);

    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResponse),
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(client).toBeDefined();
  });

  it('should call CoinGecko API with correct headers and return data', async () => {
    const result = await client.getTopTenCryptos();

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.coingecko.com/api/v3/coins/markets?order=market_cap_desc&vs_currency=usd&per_page=10&page=1&sparkline=false',
      {
        headers: {
          accept: 'application/json',
          'x-cg-demo-api-key': 'test-access-key',
        },
      },
    );

    expect(result).toEqual(mockResponse);
  });
});
