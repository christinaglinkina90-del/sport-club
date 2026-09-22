import { IsString, Length, Matches } from 'class-validator';

export class UserUpdateDto {

  @IsString()
  @Length(2, 30)
  @Matches(/^[A-Za-z\-' ]+$/, {
    message: 'Name should contain only letters, spaces, dashes and apostrophes',
  })
  newName: string;
}