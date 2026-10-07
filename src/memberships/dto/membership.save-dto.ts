import { MembershipType } from '../enums/membership-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, Length, Matches, Max, Min } from 'class-validator';

export class MembershipSaveDto {
  @ApiProperty()
  @Length(2, 30)
  @Matches(/^[A-Za-z\-' ]+$/, {
    message:
      'Name should contain only Latin capital and small letters, spaces, dashes and apostrophes',
  })
  name: string;

  @ApiProperty({ enum: MembershipType })
  @IsEnum(MembershipType)
  type: MembershipType;

  @ApiProperty()
  @Length(2, 200)
  description: string;

  @ApiProperty()
  @Min(0)
  price: number;

  @ApiProperty()
  @Min(1)
  @Max(366)
  durationInDays: number;
}
