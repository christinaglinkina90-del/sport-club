import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { NewsRepository } from './news.repository';
import { NewsMapper } from './dto/news.mapper';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from './news.entity';

@Module({
  imports: [TypeOrmModule.forFeature([News])],
  controllers: [NewsController],
  providers: [NewsService, NewsRepository, NewsMapper]
})
export class NewsModule {}
