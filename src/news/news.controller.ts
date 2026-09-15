import { Controller, Post } from '@nestjs/common';
import { NewsService } from './news.service.js';
import { NewsSaveDto } from './dto/news.save-dto.js';
import { NewsDto } from './dto/news.dto.js';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) { }
  
  @Post('news')
  async create(newsSaveDto: NewsSaveDto): Promise<NewsDto> {
    return await this.newsService.create(newsSaveDto);
  }
}
