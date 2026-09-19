import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Service } from '../service/service.entity';
import { User } from '../users/user.entity';

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ManyToOne(() => Service, { nullable: false })
  @JoinColumn({ name: 'service_id' })
  service: Service;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'trainer_id' })
  trainer: User;

  @Column({ name: 'date', type: 'date', nullable: false })
  date: Date;

  @Column({ name: 'startTime', type: 'time', nullable: false })
  startTime: string;

  @Column({ name: 'endTime', type: 'time', nullable: false })
  endTime: string;

  @Column({ name: 'capacity', type: 'int', nullable: false })
  capacity: number;

  @Column({ name: 'isActive', nullable: false, default: true })
  isActive: boolean;
}
