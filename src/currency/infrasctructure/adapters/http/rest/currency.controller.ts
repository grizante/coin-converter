import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GetExchangeRateUseCase } from '../../../../application/use-cases/get-exchange-rate.usecase';
import {
  GetExchangeRateRequestBody,
  GetExchangeRateResponseBody,
} from '../../../../interfaces/dto/controller/get-exchange-rate.dto';

@Controller('currency')
@ApiTags('Currency')
export class CurrencyController {
  constructor(
    private readonly getExchangeRateUseCase: GetExchangeRateUseCase,
  ) {}

  @Get('rate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    operationId: 'getRate',
    summary: 'Get exchange rate',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get exchange rate',
    type: GetExchangeRateResponseBody,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
  })
  async getRate(
    @Query() query: GetExchangeRateRequestBody,
  ): Promise<GetExchangeRateResponseBody> {
    const input = query.toGetExchangeRateInput();

    const result = await this.getExchangeRateUseCase.execute(input);

    return GetExchangeRateResponseBody.fromGetExchangeRateUseCase(result);
  }
}
