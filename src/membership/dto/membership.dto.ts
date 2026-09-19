import { MembershipType } from '../enum/membership-type.enum';

export class MembershipDto {
  id: number;
  name: string;
  type: MembershipType;
  description: string;
  price: number;
  durationInDays: number;
}
