import { Service } from '../services/service.entity';
import { User } from '../users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ManyToOne((): typeof Service => Service, { nullable: false })
  @JoinColumn({
    name: 'service_id',
  })
  service: Service;

  @ManyToOne((): typeof User => User, { nullable: false })
  @JoinColumn({
    name: 'trainer_id',
  })
  trainer: User;

  @Column({ name: 'date', nullable: false, unique: false, type: 'date' })
  date: Date;

  @Column({ name: 'start_time', nullable: false, unique: false, type: 'time' })
  startTime: string;

  @Column({ name: 'end_time', nullable: false, unique: false, type: 'time' })
  endTime: string;

  @Column({ name: 'capacity', nullable: false, unique: false })
  capacity: number;

  @Column({ name: 'active', nullable: false, unique: false })
  active: boolean;
}
