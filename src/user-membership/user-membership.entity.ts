import { User } from '../users/user.entity.js';
import { Membership } from '../membership/membership.entity.js';
import { MembershipStatus } from './enum/membership-status.enum.js';

export class UserMembership {
  id: number;
  user: User;
  membership: Membership;
  status: MembershipStatus;
  startDate: Date;
  endDate: Date;
}
