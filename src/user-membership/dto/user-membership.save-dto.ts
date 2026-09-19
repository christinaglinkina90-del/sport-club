import { User } from '../../users/user.entity';
import { Membership } from '../../membership/membership.entity';
import { MembershipStatus } from '../enum/membership-status.enum';

export  class UserMembershipSaveDto {
  userId: number;
  membershipId: number;
  status: MembershipStatus;
  startDate: Date;
  endDate: Date;
}