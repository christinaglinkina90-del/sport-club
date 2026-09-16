import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { News } from './news.entity.js';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class NewsRepository {
  constructor(
    @InjectRepository(News)
    private readonly repository: Repository<News>,
  ) { }

  async save(news: News): Promise<News> {
    return this.repository.create(news)
  }
}