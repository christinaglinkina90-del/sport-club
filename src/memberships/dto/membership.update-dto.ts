import { ApiProperty } from '@nestjs/swagger';
import { Length, Matches } from 'class-validator';

export class MembershipUpdateDto {
  @ApiProperty()
  @Length(2, 30)
  @Matches(/^[A-Za-z\-' ]+$/, {
    message:
      'Name should contain only Latin capital and small letters, spaces, dashes and apostrophes',
  })
  newName: string;
}
