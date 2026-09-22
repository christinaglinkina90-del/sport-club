import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Membership } from '../membership/membership.entity';
import { MembershipStatus } from './enum/membership-status.enum';

@Entity('user_memberships')
export class UserMembership {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Membership, { nullable: false })
  @JoinColumn({ name: 'membership_id' })
  membership: Membership;

  @Column({
    name: 'status',
    type: 'enum',
    enum: MembershipStatus,
    default: MembershipStatus.ACTIVE,
  })
  status: MembershipStatus;

  @Column({ name: 'startDate', type: 'date', nullable: false })
  startDate: Date;

  @Column({ name: 'endDate', type: 'date', nullable: false })
  endDate: Date;
}
