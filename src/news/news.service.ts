import { Injectable, Logger } from '@nestjs/common';
import { NewsDto } from './dto/news.dto';
import { NewsSaveDto } from './dto/news.save-dto';
import { NewsRepository } from './news.repository';
import { NewsMapper } from './dto/news.mapper';
import { News } from './news.entity';
import { EntityNotFoundError } from 'typeorm';
import { NewsUpdateDto } from './dto/news.update-dto';

@Injectable()
export class NewsService {
  private readonly logger: Logger = new Logger(NewsService.name);

  constructor(
    private readonly newsRepository: NewsRepository,
    private readonly newsMapper: NewsMapper,
  ) {}

  async create(newsSaveDto: NewsSaveDto): Promise<NewsDto> {
    const entity: News = this.newsMapper.mapDtoToEntity(newsSaveDto);
    await this.newsRepository.save(entity);

    this.logger.log(`News created: id ${entity.id}, title ${entity.title}`);

    return this.newsMapper.mapEntityToDto(entity);
  }

  async getAllNews(): Promise<NewsDto[]> {
    const news: News[] = await this.newsRepository.findAll();

    if (news.length === 0) {
      throw new EntityNotFoundError(News.name, '');
    }

    return this.newsMapper.mapEntityListToDtoList(news);
  }

  async getNewsById(id: number): Promise<NewsDto> {
    const news: News = await this.getEntityById(id);
    return this.newsMapper.mapEntityToDto(news);
  }

  private async getEntityById(id: number): Promise<News> {
    const news: News | null = await this.newsRepository.findById(id);

    if (!news) {
      throw new EntityNotFoundError(News.name, id);
    }

    return news;
  }

  async deleteById(id: number): Promise<void> {
    await this.newsRepository.delete(id);

    this.logger.log(`News deleted: id ${id}`);
  }

  async update(id: number, updateDto: NewsUpdateDto): Promise<void> {
    const foundNews: News | null = await this.newsRepository.findById(id);

    if (foundNews) {
      if (updateDto.title !== undefined) {
        foundNews.title = updateDto.title;
      }
      if (updateDto.content !== undefined) {
        foundNews.content = updateDto.content;
      }
      await this.newsRepository.save(foundNews);

      this.logger.log(`News updated: id ${id}, title ${foundNews.title}`);
    } else {
      throw new EntityNotFoundError(News.name, id);
    }
  }
}
