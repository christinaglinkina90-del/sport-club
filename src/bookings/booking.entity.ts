import { BookingStatus } from './enums/booking-status.enum';
import { User } from '../users/user.entity';
import { Schedule } from '../schedules/schedule.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ManyToOne((): typeof User => User, { nullable: false })
  @JoinColumn({
    name: 'user_id',
  })
  user: User;

  @ManyToOne(
    (): typeof Schedule => Schedule,
    (schedule: Schedule): Booking[] => schedule.bookings,
    { nullable: false },
  )
  @JoinColumn({
    name: 'schedule_id',
  })
  schedule: Schedule;

  @Column({
    name: 'status',
    nullable: false,
    type: 'enum',
    enum: BookingStatus,
  })
  status: BookingStatus;

  @Column({ name: 'created_at', nullable: false, unique: false })
  createdAt: Date;

  @Column({ name: 'active', nullable: false, unique: false })
  active: boolean;
}
