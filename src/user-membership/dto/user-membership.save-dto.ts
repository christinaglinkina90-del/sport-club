import { MembershipStatus } from '../enum/membership-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt, Min } from 'class-validator';

export  class UserMembershipSaveDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  userId: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  membershipId: number;

  @ApiProperty({ enum: MembershipStatus })
  @IsEnum(MembershipStatus)
  status: MembershipStatus;

  @ApiProperty()
  @IsDateString()
  startDate: Date;

  @ApiProperty()
  @IsDateString()
  endDate: Date;
}