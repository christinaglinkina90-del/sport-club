import { Role } from '../enum/role.enum';

export class UserDto {
  id: number;
  name: string;
  role: Role
}