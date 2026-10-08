import { MembershipStatus } from '../enums/membership-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, Min, Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { DatesValidator } from '../validation/dates.validator';

export class UserMembershipSaveDto {
  @ApiProperty()
  @Min(1)
  userId: number;

  @ApiProperty()
  @Min(1)
  membershipId: number;

  @ApiProperty({ enum: MembershipStatus })
  @IsEnum(MembershipStatus)
  status: MembershipStatus;

  @ApiProperty()
  @Validate(DatesValidator, {
    message:
      'Start date and end date should be valid dates. End date should be later than start date. Max membership period is 1 year.',
  })
  @Type((): DateConstructor => Date)
  startDate: Date;

  @ApiProperty()
  @Type((): DateConstructor => Date)
  endDate: Date;
}
