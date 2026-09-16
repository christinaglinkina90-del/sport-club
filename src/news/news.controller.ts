import { Controller, Get, Post } from '@nestjs/common';
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

  @Get('news')
  async getAll(): Promise<NewsDto[]> {
    return this.newsService.getAllNews();
  }
}
