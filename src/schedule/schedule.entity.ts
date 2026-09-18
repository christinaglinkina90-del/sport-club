import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('schedules')
export class Schedule

{@PrimaryGeneratedColumn()
  id: number;

@Column({ name: 'service_id', type: 'integer', nullable: false })
serviceId: number;

  @Column({ name: 'trainer_id', type: 'integer', nullable: false })
  trainerId: number;


  @Column({ name: 'date', type: 'date', nullable: false })

  date: string;


  @Column({ name: 'start_time', type: 'time', nullable: false })
  startTime: string;

  @Column({ name: 'end_time', type: 'time', nullable: false })
  endTime: string;

  @Column({ name: 'capacity', type: 'integer', nullable: false })
  capacity: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date}
