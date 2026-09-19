import { MembershipType } from '../enum/membership-type.enum';

export class MembershipSaveDto {
  name: string;
  type: MembershipType;
  description: string;
  price: number;
  durationInDays: number;
}
