import { Injectable } from '@nestjs/common';
import { NewsDto } from './dto/news.dto.js';
import { NewsSaveDto } from './dto/news.save-dto.js';
import { NewsRepository } from './news.repository.js';
import { NewsMapper } from './dto/news.mapper.js';
import { News } from './news.entity.js';

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
}
