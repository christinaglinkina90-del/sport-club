import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class MembershipPaymentSaveDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  userId: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  membershipId: number;
}
