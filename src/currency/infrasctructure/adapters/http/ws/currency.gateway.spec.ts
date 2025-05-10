import { Test, TestingModule } from '@nestjs/testing';
import { Socket } from 'socket.io';

import { CurrencyGateway } from './currency.gateway';
import { GetExchangeRateUseCase } from '../../../../application/use-cases/get-exchange-rate.usecase';
import { ConvertCurrencyUseCase } from '../../../../application/use-cases/convert-currency.usecase';

jest.useFakeTimers();

describe('CurrencyGateway', () => {
  let gateway: CurrencyGateway;
  let getRateUseCaseMock: { execute: jest.Mock };
  let convertCurrencyUseCaseMock: { execute: jest.Mock };
  let emitMock: jest.Mock;
  let socketMock: Partial<Socket>;

  beforeEach(async () => {
    getRateUseCaseMock = {
      execute: jest.fn().mockResolvedValue(1.23),
    };

    convertCurrencyUseCaseMock = {
      execute: jest.fn().mockResolvedValue(123.45),
    };

    emitMock = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CurrencyGateway,
        { provide: GetExchangeRateUseCase, useValue: getRateUseCaseMock },
        {
          provide: ConvertCurrencyUseCase,
          useValue: convertCurrencyUseCaseMock,
        },
      ],
    }).compile();

    gateway = module.get<CurrencyGateway>(CurrencyGateway);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    gateway.server = { emit: emitMock } as any;

    socketMock = {
      emit: emitMock,
      on: jest.fn(),
    };
  });

  it('should stream rate updates and unsubscribe on disconnect', async () => {
    gateway.handleRateStream({ from: 'USD', to: 'EUR' }, socketMock as Socket);

    await jest.runOnlyPendingTimersAsync();

    expect(getRateUseCaseMock.execute).toHaveBeenCalledWith({
      from: 'USD',
      to: 'EUR',
    });
    expect(emitMock).toHaveBeenCalledWith(
      'rateUpdate',
      expect.objectContaining({
        rate: 1.23,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        timestamp: expect.any(String),
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

  it('should stream converted currency updates and unsubscribe on disconnect', async () => {
    gateway.handleConvertCurrencyStream(
      { from: 'USD', to: 'EUR', amount: 100 },
      socketMock as Socket,
    );

    await jest.runOnlyPendingTimersAsync();

    expect(convertCurrencyUseCaseMock.execute).toHaveBeenCalledWith({
      from: 'USD',
      to: 'EUR',
      amount: 100,
    });

    expect(emitMock).toHaveBeenCalledWith(
      'amountUpdate',
      expect.objectContaining({
        amount: 123.45,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        timestamp: expect.any(String),
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
