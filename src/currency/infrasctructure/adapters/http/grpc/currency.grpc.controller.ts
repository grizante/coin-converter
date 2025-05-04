import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GetExchangeRateUseCase } from '../../../../application/use-cases/get-exchange-rate.usecase';

@Controller()
export class CurrencyGrpcController {
  constructor(private readonly getRateUseCase: GetExchangeRateUseCase) {}

  @GrpcMethod('CurrencyService', 'GetRate')
  async getRate(data: { from: string; to: string }): Promise<{ rate: number }> {
    const rate = await this.getRateUseCase.execute(data);
    return { rate };
  }
}
