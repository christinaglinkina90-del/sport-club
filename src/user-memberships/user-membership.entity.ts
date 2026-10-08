import { MembershipStatus } from './enums/membership-status.enum';
import { User } from '../users/user.entity';
import { Membership } from '../memberships/membership.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('user_memberships')
export class UserMembership {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ManyToOne((): typeof User => User, { nullable: false })
  @JoinColumn({
    name: 'user_id',
  })
  user: User;

  @ManyToOne((): typeof Membership => Membership, { nullable: false })
  @JoinColumn({
    name: 'membership_id',
  })
  membership: Membership;

  @Column({
    name: 'status',
    nullable: false,
    type: 'enum',
    enum: MembershipStatus,
  })
  status: MembershipStatus;

  @Column({ name: 'start_date', nullable: false, unique: false })
  startDate: Date;

  @Column({ name: 'end_date', nullable: false, unique: false })
  endDate: Date;

  @Column({ name: 'active', nullable: false, unique: false })
  active: boolean;
}
