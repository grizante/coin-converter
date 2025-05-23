import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { mergeMap, timer } from 'rxjs';
import { GetTopTenCryptosUseCase } from '../../../../application/use-cases/get-top-cryptos.usecase';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class CryptoGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly getTopTenCryptosUseCase: GetTopTenCryptosUseCase,
  ) {}

  @SubscribeMessage('getTopTenCryptos')
  handleGetTopTenCryptosEvent(
    @MessageBody() data: { currency?: string },
    @ConnectedSocket() client: Socket,
  ) {
    const stream$ = timer(0, 60_000).pipe(
      mergeMap(async () => {
        const cryptos = await this.getTopTenCryptosUseCase.execute(data);
        if (!cryptos) {
          return null;
        }
        return {
          cryptos: cryptos.map((crypto) => ({
            symbol: crypto.symbol,
            name: crypto.name,
            current_price: crypto.current_price,
            market_cap: crypto.market_cap,
            market_cap_rank: crypto.market_cap_rank,
          })),
          last_updated: new Date().toISOString(),
        };
      }),
    );

    const subscription = stream$.subscribe({
      next: (cryptosData) => this.server.emit('cryptosUpdate', cryptosData),
    });

    client.on('disconnect', () => {
      subscription.unsubscribe();
    });
  }
}
