import { Controller, Patch, Get, Param, Post, Delete, HttpStatus, HttpCode, ParseIntPipe, Body } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsSaveDto } from './dto/news.save-dto';
import { NewsDto } from './dto/news.dto';
import { NewsUpdateDto } from './dto/news.update-dto';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) { }
  
  @Post()
  async create(newsSaveDto: NewsSaveDto): Promise<NewsDto> {
    return await this.newsService.create(newsSaveDto);
  }

  @Get()
  async getAll(): Promise<NewsDto[]> {
    return this.newsService.getAllNews();
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<NewsDto> {
    return this.newsService.getNewsById(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.newsService.deleteById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: NewsUpdateDto,
  ): Promise<void> {
    await this.newsService.update(id, updateDto);
  }
}
