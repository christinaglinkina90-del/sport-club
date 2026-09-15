import { Role } from './enum/role.enum.js';

export class User {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: Role;
  active: boolean;
}