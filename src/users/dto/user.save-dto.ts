import { IsEmail, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserSaveDto {
  @ApiProperty()
  @IsString()
  @Length(2, 30)
  @Matches(/^[A-Za-z\-' ]+$/, {
    message: 'Name should contain only letters, spaces, dashes and apostrophes',
  })
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @Length(8, 20)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/, {
    message:
      'Password must contain at least one uppercase, one lowercase and one digit',
  })
  password: string;

  @ApiProperty()
  @IsString()
  @Length(2, 30)
  phone: string;
}
