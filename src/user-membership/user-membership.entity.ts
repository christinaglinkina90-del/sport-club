import { User } from '../users/user.entity';
import { Membership } from '../membership/membership.entity';
import { MembershipStatus } from './enum/membership-status.enum';

export class UserMembership {
  id: number;
  user: User;
  membership: Membership;
  status: MembershipStatus;
  startDate: Date;
  endDate: Date;
}
