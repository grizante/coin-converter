import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GetTopTenCryptosUseCase } from '../../../../application/use-cases/get-top-cryptos.usecase';
import { GetTopTenCryptosResponseBody } from '../../../../interfaces/dto/controller/get-top-ten-cryptos.dto';

@Controller('crypto')
@ApiTags('Crypto')
export class CryptoController {
  constructor(
    private readonly getTopTenCryptosUseCase: GetTopTenCryptosUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    operationId: 'getTopTenCryptos',
    summary: 'Get top ten cryptos',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get top ten cryptos',
    type: GetTopTenCryptosResponseBody,
  })
  async getTopTenCryptos(): Promise<GetTopTenCryptosResponseBody> {
    const cryptos = await this.getTopTenCryptosUseCase.execute();

    return GetTopTenCryptosResponseBody.fromCoinGeckoCoinsListWithMarketDataResponse(
      cryptos,
    );
  }
}
