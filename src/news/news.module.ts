import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from './news.entity';
import { NewsService } from './news.service';
import { NewsRepository } from './news.repository';
import { NewsMapper } from './dto/news.mapper';
import { NewsValidator } from './validation/news.validator';

@Module({
  controllers: [NewsController],
  imports: [TypeOrmModule.forFeature([News])],
  providers: [NewsService, NewsRepository, NewsMapper, NewsValidator],
  exports: [NewsService, NewsMapper],
})
export class NewsModule {}
