import { Role } from '../enums/role.enum';
import { ApiProperty } from '@nestjs/swagger';

// Полные данные пользователя - только для администратора.
export class UserDetailsDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty({ enum: Role })
  role: Role;

  @ApiProperty()
  active: boolean;
}
