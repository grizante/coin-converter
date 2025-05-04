import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { mergeMap, timer } from 'rxjs';
import { Server, Socket } from 'socket.io';

import { ConvertCurrencyUseCase } from '../../../../application/use-cases/convert-currency.usecase';
import { GetExchangeRateUseCase } from '../../../../application/use-cases/get-exchange-rate.usecase';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class CurrencyGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly getRateUseCase: GetExchangeRateUseCase,
    private readonly convertCurrencyUseCase: ConvertCurrencyUseCase,
  ) {}

  @SubscribeMessage('startRateStream')
  handleRateStream(
    @MessageBody() data: { from: string; to: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { from, to } = data;

    const stream$ = timer(0, 60_000).pipe(
      mergeMap(() =>
        this.getRateUseCase.execute({ from, to }).then((rate) => ({
          rate,
          timestamp: new Date().toISOString(),
        })),
      ),
    );

    const subscription = stream$.subscribe({
      next: (rateData) => client.emit('rateUpdate', rateData),
    });

    client.on('disconnect', () => {
      subscription.unsubscribe();
    });
  }

  @SubscribeMessage('startConvertCurrencyStream')
  handleConvertCurrencyStream(
    @MessageBody() data: { from: string; to: string; amount: number },
    @ConnectedSocket() client: Socket,
  ) {
    const { from, to, amount } = data;

    const stream$ = timer(0, 60_000).pipe(
      mergeMap(() =>
        this.convertCurrencyUseCase
          .execute({ from, to, amount })
          .then((amount) => ({
            amount,
            timestamp: new Date().toISOString(),
          })),
      ),
    );

    const subscription = stream$.subscribe({
      next: (amountData) => client.emit('amountUpdate', amountData),
    });

    client.on('disconnect', () => {
      subscription.unsubscribe();
    });
  }
}
