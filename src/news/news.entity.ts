import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('news')
export class News {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ name: 'title', nullable: false, unique: false })
  title: string;
  @Column({ name: 'content', nullable: true, unique: false })
  content: string;
  @Column({ name: 'created_at', nullable: false, unique: false })
  createdAt: Date;
}
