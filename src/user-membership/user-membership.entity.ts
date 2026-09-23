import { User } from '../users/user.entity';
import { Membership } from '../membership/membership.entity';
import { MembershipStatus } from './enum/membership-status.enum';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PaymentType } from '../payment/enum/payment-type.enum';

@Entity('user_memberships')
export class UserMembership {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;
  @Column({ nullable: false })
  user: User;
  @OneToOne((): typeof Membership => Membership)
  membership: Membership;
  @Column({ nullable: false, type: 'enum', enum: MembershipStatus })
  status: MembershipStatus;
  @Column({ type: 'timestamp', nullable: false })
  startDate: Date;
  @Column({ type: 'timestamp', nullable: false })
  endDate: Date;
}
