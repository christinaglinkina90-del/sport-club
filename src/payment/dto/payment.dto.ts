import { PaymentType } from '../enum/payment-type.enum';
import { PaymentStatus } from '../enum/payment-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class PaymentDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  type: PaymentType;

  @ApiProperty()
  status: PaymentStatus;

  @ApiProperty()
  createdAt: Date;
}
