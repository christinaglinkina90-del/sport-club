import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class MembershipUpdateDto {
  @ApiProperty()
  @IsString()
  @Length(2, 30)
  newName: string;
}
