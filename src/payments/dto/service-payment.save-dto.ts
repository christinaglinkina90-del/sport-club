import { ApiProperty } from '@nestjs/swagger';
import { Min } from 'class-validator';

export class ServicePaymentSaveDto {
  @ApiProperty()
  @Min(1)
  userId: number;

  @ApiProperty()
  @Min(1)
  serviceId: number;
}
