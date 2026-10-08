import { MembershipStatus } from '../enums/membership-status.enum';
import { UserDto } from '../../users/dto/user.dto';
import { MembershipDto } from '../../memberships/dto/membership.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UserMembershipDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  user: UserDto;

  @ApiProperty()
  membership: MembershipDto;

  @ApiProperty({ enum: MembershipStatus })
  status: MembershipStatus;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;
}
