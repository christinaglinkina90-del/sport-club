import { MembershipType } from '../enum/membership-type.enum';
import { ApiProperty } from '@nestjs/swagger';

export class MembershipDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  type: MembershipType;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  durationInDays: number;
}
