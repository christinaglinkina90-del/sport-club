import { PaymentType } from '../enums/payment-type.enum';
import { PaymentStatus } from '../enums/payment-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../users/dto/user.dto';

export class PaymentDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  user: UserDto;

  @ApiProperty()
  amount: number;

  @ApiProperty({ enum: PaymentType })
  type: PaymentType;

  @ApiProperty({ enum: PaymentStatus })
  status: PaymentStatus;

  @ApiProperty()
  createdAt: Date;
}
