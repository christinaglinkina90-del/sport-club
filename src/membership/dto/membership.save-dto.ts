import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString, Length, Min } from 'class-validator';
import { MembershipType } from '../enum/membership-type.enum';

export class MembershipSaveDto {
  @ApiProperty()
  @IsString()
  @Length(2, 30)
  name: string;

  @ApiProperty({ enum: MembershipType })
  @IsEnum(MembershipType)
  type: MembershipType;

  @ApiProperty()
  @IsString()
  @Length(2, 200)
  description: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  durationInDays: number;
}
