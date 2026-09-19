import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { PaymentType } from './enum/payment-type.enum';
import { PaymentStatus } from './enum/payment-status.enum';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    name: 'amount',
    nullable: false,
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  amount: number;

  @Column({ name: 'type', nullable: false, type: 'enum', enum: PaymentType })
  type: PaymentType;

  @Column({ name: 'status', nullable: false, type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Column({ name: 'createdAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}