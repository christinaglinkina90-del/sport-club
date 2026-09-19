import { MembershipStatus } from '../enum/membership-status.enum';
import { UserDto } from '../../users/dto/user.dto';
import { MembershipDto } from '../../membership/dto/membership.dto';

export class UserMembershipDto {
  id: number;
  user: UserDto;
  membership: MembershipDto;
  status: MembershipStatus;
  startDate: Date;
  endDate: Date;
}