import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from './news.entity';

@Injectable()
export class NewsRepository {
  constructor(
    @InjectRepository(News)
    private readonly repository: Repository<News>,
  ) {}

  async save(news: News): Promise<News> {
    return this.repository.save(news);
  }

  async findAll(): Promise<News[]> {
    return this.repository.find();
  }

  async findById(id: number): Promise<News | null> {
    return this.repository.findOneBy({ id });
  }

  async deleteById(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
