import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('news')
export class News {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'title', nullable: false, unique: false })
  title: string;

  @Column({ name: 'content', nullable: false, unique: false })
  content: string;

  @Column({ name: 'created_at', nullable: false, unique: false })
  createdAt: Date;

  @Column({ name: 'active', nullable: false, unique: false })
  active: boolean;
}
