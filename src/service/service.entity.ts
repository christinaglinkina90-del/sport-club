import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ServiceType } from './enum/service-type.enum';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'type', nullable: false, type: 'enum', enum: ServiceType })
  type: ServiceType;

  @Column({ name: 'description', nullable: true })
  description: string;

  @Column({
    name: 'price',
    nullable: false,
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  price: number;

  @Column({ name: 'details', nullable: true, type: 'json' })
  details: Record<string, any>;

  @Column({ name: 'isActive', nullable: false, default: true })
  isActive: boolean;
}
