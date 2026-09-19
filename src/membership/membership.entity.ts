import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { MembershipType } from './enum/membership-type.enum';

@Entity('memberships')
export class Membership {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'type', nullable: false, type: 'enum', enum: MembershipType })
  type: MembershipType;

  @Column({ name: 'description', nullable: true })
  description: string;

  @Column({
    name: 'price',
    nullable: false,
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  price: number;

  @Column({ name: 'durationInDays', nullable: false })
  durationInDays: number;

  @Column({ name: 'isActive', nullable: false, default: true })
  isActive: boolean;
}
