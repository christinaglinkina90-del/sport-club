import { User } from '../users/user.entity';
import { Membership } from '../membership/membership.entity';
import { MembershipStatus } from './enum/membership-status.enum';
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
  @ManyToOne((): typeof User => User)
  @JoinColumn({
    name: 'userId',
  })
  user: User;
  @ManyToOne((): typeof Membership => Membership)
  @JoinColumn({
    name: 'membershipId',
  })
  membership: Membership;
  @Column({ nullable: false, type: 'enum', enum: MembershipStatus })
  status: MembershipStatus;
  @Column({ type: 'timestamp', nullable: false })
  startDate: Date;
  @Column({ type: 'timestamp', nullable: false })
  endDate: Date;
}
