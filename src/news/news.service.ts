import { Injectable, Logger } from '@nestjs/common';
import { News } from './news.entity';
import { NewsRepository } from './news.repository';
import { NewsMapper } from './dto/news.mapper';
import { NewsSaveDto } from './dto/news.save-dto';
import { NewsDto } from './dto/news.dto';
import { NewsUpdateDto } from './dto/news.update-dto';
import { NewsValidator } from './validation/news.validator';
import { EntityNotFoundException } from '../exceptions/types/entity-not-found.exception';

@Injectable()
export class NewsService {
  private readonly logger: Logger = new Logger(NewsService.name);

  constructor(
    private readonly repository: NewsRepository,
    private readonly mapper: NewsMapper,
    private readonly validator: NewsValidator,
  ) {}

  async create(saveDto: NewsSaveDto): Promise<NewsDto> {
    this.validator.validateSaveDto(saveDto);
    const entity: News = this.mapper.mapDtoToEntity(saveDto);
    entity.createdAt = new Date();
    entity.active = true;
    await this.repository.save(entity);

    this.logger.log(`News created: id ${entity.id}, title ${entity.title}`);

    return this.mapper.mapEntityToDto(entity);
  }

  async getAllActiveNews(): Promise<NewsDto[]> {
    const news: News[] = await this.repository.findAllActive();

    if (news.length === 0) {
      throw new EntityNotFoundException(News.name);
    }

    return this.mapper.mapEntityListToDtoList(news);
  }

  async getActiveNewsById(id: number): Promise<NewsDto> {
    const news: News = await this.getActiveEntityById(id);
    return this.mapper.mapEntityToDto(news);
  }

  private async getActiveEntityById(id: number): Promise<News> {
    const news: News | null = await this.repository.findById(id);

    if (!news || !news.active) {
      throw new EntityNotFoundException(News.name, id);
    }

    return news;
  }

  async update(id: number, updateDto: NewsUpdateDto): Promise<void> {
    this.validator.validateUpdateDto(updateDto);
    const foundNews: News = await this.getActiveEntityById(id);

    if (updateDto.newTitle) {
      foundNews.title = updateDto.newTitle;
    }

    if (updateDto.newContent) {
      foundNews.content = updateDto.newContent;
    }

    await this.repository.save(foundNews);

    this.logger.log(`News updated: id ${id}, title ${foundNews.title}`);
  }

  async deleteById(id: number): Promise<void> {
    const news: News = await this.getActiveEntityById(id);
    news.active = false;
    await this.repository.save(news);

    this.logger.log(`News marked as inactive: id ${id}`);
  }

  async restoreById(id: number): Promise<void> {
    const news: News | null = await this.repository.findById(id);

    if (!news) {
      throw new EntityNotFoundException(News.name, id);
    }

    if (!news.active) {
      news.active = true;
      await this.repository.save(news);

      this.logger.log(`News marked as active: id ${id}`);
    }
  }
}
