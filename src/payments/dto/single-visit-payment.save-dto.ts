import { ApiProperty } from '@nestjs/swagger';
import { Min } from 'class-validator';

export class SingleVisitPaymentSaveDto {
  @ApiProperty()
  @Min(1)
  userId: number;

  @ApiProperty()
  @Min(1)
  bookingId: number;
}
