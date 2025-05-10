import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { ConvertCurrencyInput } from '../service/convert-currency.dto';

export class ConvertCurrencyRequestBody {
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

  @IsNumber()
  @Transform(({ value }: { value: number }) => Number(value))
  @ApiProperty({
    type: Number,
    example: 100,
    description: 'Amount',
  })
  amount: number;

  toConvertCurrencyInput(): ConvertCurrencyInput {
    return {
      from: this.from,
      to: this.to,
      amount: this.amount,
    };
  }
}

export class ConvertCurrencyResponseBody {
  @ApiProperty({
    type: Number,
    example: 100,
    description: 'Amount',
  })
  amount: number;

  static fromConvertCurrencyUseCase(
    amount: number,
  ): ConvertCurrencyResponseBody {
    return {
      amount,
    };
  }
}
