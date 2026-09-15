import { MembershipType } from './enum/membership-type.enum.js';

export class Membership {
  id: number;
  name: string;
  type: MembershipType;
  description: string;
  price: number;
  durationInDays: number;
  isActive: boolean;
}
