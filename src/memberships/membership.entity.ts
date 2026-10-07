import { MembershipType } from './enums/membership-type.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('memberships')
export class Membership {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'name', nullable: false, unique: false })
  name: string;

  @Column({
    name: 'type',
    nullable: false,
    type: 'enum',
    enum: MembershipType,
  })
  type: MembershipType;

  @Column({ name: 'description', nullable: false, unique: false })
  description: string;

  @Column({ name: 'price_in_cents', nullable: false, unique: false })
  priceInCents: number;

  @Column({ name: 'duration_in_days', nullable: false, unique: false })
  durationInDays: number;

  @Column({ name: 'active', nullable: false, unique: false })
  active: boolean;
}
