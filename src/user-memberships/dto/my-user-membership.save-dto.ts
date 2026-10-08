import { ApiProperty } from '@nestjs/swagger';
import { Min } from 'class-validator';

export class MyUserMembershipSaveDto {
  @ApiProperty()
  @Min(1)
  membershipId: number;
}
