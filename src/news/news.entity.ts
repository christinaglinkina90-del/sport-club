import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('news')
export class News {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ name: 'title', nullable: false, unique: false })
  title: string;
  @Column({ name: 'content', nullable: true, unique: false })
  content: string;
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
