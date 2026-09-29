import { MembershipStatus } from '../enum/membership-status.enum';
import { UserDto } from '../../users/dto/user.dto';
import { MembershipDto } from '../../membership/dto/membership.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UserMembershipDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  user: UserDto;

  @ApiProperty()
  membership: MembershipDto;

  @ApiProperty()
  status: MembershipStatus;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;
}