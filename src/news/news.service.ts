import { Injectable } from '@nestjs/common';
import { NewsDto } from './dto/news.dto.js';
import { NewsSaveDto } from './dto/news.save-dto.js';
import { NewsRepository } from './news.repository.js';
import { NewsMapper } from './dto/news.mapper.js';
import { News } from './news.entity.js';
import { EntityNotFoundError } from 'typeorm';
import { NewsUpdateDto } from './dto/news.update-dto.js';

@Injectable()
export class NewsService {
  
  constructor(
    private readonly newsRepository: NewsRepository,
    private readonly newsMapper: NewsMapper,
  ) { }

  async create(newsSaveDto: NewsSaveDto): Promise<NewsDto> {
    const entity: News = this.newsMapper.mapDtoToEntity(newsSaveDto);
    await this.newsRepository.save(entity);
    return this.newsMapper.mapEntityToDto(entity);
  }

  async getAllNews(): Promise<NewsDto[]> {
    const news: News[] = await this.newsRepository.findAll();

    if (news.length === 0) {
      // todo необходимо создать логгер и классы исключений
      // throw new EntityNotFoundException(News.name);
      throw new EntityNotFoundError(News.name, '');
    }

    return this.newsMapper.mapEntityListToDtoList(news);
  }

  async getNewsById(id: number): Promise<NewsDto> {
    const policy: News = await this.getEntityById(id);
    return this.newsMapper.mapEntityToDto(policy);
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
  }

  async update(id: number, updateDto: NewsUpdateDto): Promise<void> {
    // this.validator.validateUpdateDto(updateDto);
    const foundNews: News | null = await this.newsRepository.findById(id);

    if (foundNews) {
      foundNews.title = updateDto.newTitle;
      foundNews.content = updateDto.newContent;
      await this.newsRepository.save(foundNews);

      // this.logger.log(`User updated: id ${id}, new name ${foundNews.title}`);
    } else {
      // throw new EntityNotFoundException(User.name, id);
      throw new EntityNotFoundError(News.name, id);
    }
  }

}
