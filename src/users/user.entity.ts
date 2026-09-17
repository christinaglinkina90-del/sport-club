import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './enum/role.enum';


@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'email', nullable: false, unique: true })
  email: string;

  @Column({ name: 'password', nullable: false })
  password: string;

  @Column({ name: 'phone', nullable: true })
  phone: string;

  @Column({ name: 'role', nullable: false, type: 'enum', enum: Role })
  role: Role;

  @Column({ name: 'active', nullable: false, default: true })
  active: boolean;
}
