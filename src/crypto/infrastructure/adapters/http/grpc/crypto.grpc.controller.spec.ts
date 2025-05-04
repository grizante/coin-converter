import { Test, TestingModule } from '@nestjs/testing';
import { take } from 'rxjs';

import { GetTopTenCryptosUseCase } from '../../../../application/use-cases/get-top-cryptos.usecase';
import { CryptoGrpcController } from './crypto.grpc.controller';

describe('CryptoGrpcController', () => {
  let controller: CryptoGrpcController;
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

  beforeEach(async () => {
    useCaseMock = {
      execute: jest.fn().mockResolvedValue(mockCryptoData),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CryptoGrpcController],
      providers: [{ provide: GetTopTenCryptosUseCase, useValue: useCaseMock }],
    }).compile();

    controller = module.get<CryptoGrpcController>(CryptoGrpcController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should stream formatted crypto data', (done) => {
    const stream$ = controller.streamGetTopTenCryptos();

    stream$.pipe(take(1)).subscribe((data) => {
      expect(useCaseMock.execute).toHaveBeenCalled();
      expect(data).toHaveProperty('cryptos');
      expect(data).toHaveProperty('last_updated');

      expect(data.cryptos).toEqual([
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
      ]);

      expect(typeof data.last_updated).toBe('string');
      done();
    });
  });
});
