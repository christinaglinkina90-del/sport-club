import { PaymentType } from './enums/payment-type.enum';
import { PaymentStatus } from './enums/payment-status.enum';
import { User } from '../users/user.entity';
import { UserMembership } from '../user-memberships/user-membership.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ManyToOne((): typeof User => User, { nullable: false })
  @JoinColumn({
    name: 'user_id',
  })
  user: User;

  // Заполняется только для оплаты абонемента по заявке клиента.
  @ManyToOne((): typeof UserMembership => UserMembership, { nullable: true })
  @JoinColumn({
    name: 'user_membership_id',
  })
  userMembership: UserMembership | null;

  @Column({ name: 'amount_in_cents', nullable: false, unique: false })
  amountInCents: number;

  @Column({ name: 'type', nullable: false, type: 'enum', enum: PaymentType })
  type: PaymentType;

  @Column({
    name: 'status',
    nullable: false,
    type: 'enum',
    enum: PaymentStatus,
  })
  status: PaymentStatus;

  @Column({ name: 'created_at', nullable: false, unique: false })
  createdAt: Date;

  @Column({ name: 'active', nullable: false, unique: false })
  active: boolean;
}
