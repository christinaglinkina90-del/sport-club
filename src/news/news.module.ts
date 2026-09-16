import { Module } from '@nestjs/common';
import { NewsController } from './news.controller.js';
import { NewsService } from './news.service.js';
import { NewsRepository } from './news.repository.js';
import { NewsMapper } from './dto/news.mapper.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from './news.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([News])],
  controllers: [NewsController],
  providers: [NewsService, NewsRepository, NewsMapper]
})
export class NewsModule {}
