import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ConvertCurrencyUseCase } from '../../../../application/use-cases/convert-currency.usecase';
import { GetExchangeRateUseCase } from '../../../../application/use-cases/get-exchange-rate.usecase';
import {
  ConvertCurrencyRequestBody,
  ConvertCurrencyResponse,
} from '../../../../interfaces/dto/controller/convert-currency.dto';
import {
  GetExchangeRateRequestBody,
  GetExchangeRateResponseBody,
} from '../../../../interfaces/dto/controller/get-exchange-rate.dto';
import { ConvertCurrencyInput } from '../../../../interfaces/dto/service/convert-currency.dto';
import { GetExchangeRateInput } from '../../../../interfaces/dto/service/get-exchange-rate.dto';

@Controller('currency')
@ApiTags('Currency')
export class CurrencyController {
  constructor(
    private readonly getExchangeRateUseCase: GetExchangeRateUseCase,
    private readonly convertCurrencyUseCase: ConvertCurrencyUseCase,
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
    const input: GetExchangeRateInput = query.toGetExchangeRateInput
      ? query.toGetExchangeRateInput()
      : {
          from: query.from,
          to: query.to,
        };

    const result = await this.getExchangeRateUseCase.execute(input);

    return GetExchangeRateResponseBody.fromGetExchangeRateUseCase(result);
  }

  @Get('convert')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    operationId: 'convertCurrency',
    summary: 'Convert currency',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Convert currency',
    type: GetExchangeRateResponseBody,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
  })
  async convertCurrency(
    @Query() query: ConvertCurrencyRequestBody,
  ): Promise<ConvertCurrencyResponse> {
    const input: ConvertCurrencyInput = query.toConvertCurrencyInput
      ? query.toConvertCurrencyInput()
      : {
          from: query.from,
          to: query.to,
          amount: Number(query.amount),
        };

    const result = await this.convertCurrencyUseCase.execute(input);

    return ConvertCurrencyResponse.fromConvertCurrencyUseCase(result);
  }
}
