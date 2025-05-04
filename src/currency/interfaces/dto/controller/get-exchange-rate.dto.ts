import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

import { GetExchangeRateInput } from '../service/get-exchange-rate.dto';

export class GetExchangeRateRequestBody {
  @IsString()
  @Transform(({ value }: { value: string }) => value.toUpperCase())
  @ApiProperty({
    type: String,
    example: 'USD',
    description: 'From currency',
  })
  from: string;

  @IsString()
  @Transform(({ value }: { value: string }) => value.toUpperCase())
  @ApiProperty({
    type: String,
    example: 'EUR',
    description: 'To currency',
  })
  to: string;

  toGetExchangeRateInput(): GetExchangeRateInput {
    return {
      from: this.from,
      to: this.to,
    };
  }
}

export class GetExchangeRateResponseBody {
  rate: number;

  static fromGetExchangeRateUseCase(rate: number): GetExchangeRateResponseBody {
    return {
      rate,
    };
  }
}
