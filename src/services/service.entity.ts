import { ServiceType } from './enums/service-type.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'name', nullable: false, unique: true })
  name: string;

  @Column({ name: 'type', nullable: false, type: 'enum', enum: ServiceType })
  type: ServiceType;

  @Column({ name: 'description', nullable: false, unique: false })
  description: string;

  @Column({ name: 'price_in_cents', nullable: false, unique: false })
  priceInCents: number;

  @Column({ name: 'active', nullable: false, unique: false })
  active: boolean;
}
