import { Injectable } from '@nestjs/common';
import { NewsDto } from './dto/news.dto.js';
import { NewsSaveDto } from './dto/news.save-dto.js';
import { NewsRepository } from './news.repository.js';
import { NewsMapper } from './dto/news.mapper.js';
import { News } from './news.entity.js';
import { EntityNotFoundError } from 'typeorm';

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

  // async getAllActivePolicies(): Promise<PolicyDto[]> {
  //   const policies: Policy[] = await this.repository.findAllActive();

  //   if (policies.length === 0) {
  //     throw new EntityNotFoundException(Policy.name);
  //   }

  //   policies.forEach((p: Policy): void => this.excludeInactiveCars(p));
  //   return this.mapper.mapEntityListToDtoList(policies);
  // }

  async getAllNews(): Promise<NewsDto[]> {
    const news: News[] = await this.newsRepository.findAll();

    if (news.length === 0) {
      // todo необходимо создать логгер и классы исключений
      // throw new EntityNotFoundException(News.name);
      throw new EntityNotFoundError(News.name, '');
    }

    return this.newsMapper.mapEntityListToDtoList(news);
  }
}
