import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { interval, mergeMap } from 'rxjs';
import { Server, Socket } from 'socket.io';

import { GetExchangeRateUseCase } from '../../../../application/use-cases/get-exchange-rate.usecase';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class CurrencyGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly getRateUseCase: GetExchangeRateUseCase) {}

  @SubscribeMessage('startRateStream')
  handleRateStream(
    @MessageBody() data: { from: string; to: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { from, to } = data;

    const stream$ = interval(60000).pipe(
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
}
