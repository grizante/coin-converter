import { Test, TestingModule } from '@nestjs/testing';
import { Socket } from 'socket.io';

import { GetTopTenCryptosUseCase } from '../../../../application/use-cases/get-top-cryptos.usecase';
import { CryptoGateway } from './crypto.gateway';

jest.useFakeTimers();

describe('CryptoGateway', () => {
  let gateway: CryptoGateway;
  let useCaseMock: { execute: jest.Mock };
  let emitMock: jest.Mock;
  let socketMock: Partial<Socket>;

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

    emitMock = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CryptoGateway,
        { provide: GetTopTenCryptosUseCase, useValue: useCaseMock },
      ],
    }).compile();

    gateway = module.get<CryptoGateway>(CryptoGateway);

    gateway.server = {
      emit: emitMock,
    } as unknown as typeof gateway.server;

    socketMock = {
      on: jest.fn(),
    };
  });

  it('should emit formatted crypto data and clean up on disconnect', async () => {
    gateway.handleGetTopTenCryptosEvent({}, socketMock as Socket);

    await jest.runOnlyPendingTimersAsync();

    expect(useCaseMock.execute).toHaveBeenCalledTimes(1);
    expect(emitMock).toHaveBeenCalledWith(
      'cryptosUpdate',
      expect.objectContaining({
        cryptos: mockCryptoData,
      }),
    );

    const onCalls = (socketMock.on as jest.Mock).mock.calls;
    const disconnectHandler = onCalls.find(
      ([event]) => event === 'disconnect',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    )?.[1] as () => void;

    expect(typeof disconnectHandler).toBe('function');

    disconnectHandler();
  });
});
