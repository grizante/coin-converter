import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GetTopTenCryptosUseCase } from '../../../../application/use-cases/get-top-cryptos.usecase';
import {
  GetTopTenCryptosRequestBody,
  GetTopTenCryptosResponseBody,
} from '../../../../interfaces/dto/controller/get-top-ten-cryptos.dto';
import { GetTopTenCryptosInput } from '../../../../interfaces/dto/service/get-top-ten-cryptos.dto';

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
  async getTopTenCryptos(
    @Query() query: GetTopTenCryptosRequestBody,
  ): Promise<GetTopTenCryptosResponseBody> {
    const input: GetTopTenCryptosInput = query.toGetTopTenCryptosInput
      ? query.toGetTopTenCryptosInput()
      : {
          currency: query.currency,
        };

    const cryptos = await this.getTopTenCryptosUseCase.execute(input);

    return GetTopTenCryptosResponseBody.fromCoinGeckoCoinsListWithMarketDataResponse(
      cryptos,
    );
  }
}
