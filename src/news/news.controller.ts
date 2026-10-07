import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { NewsDto } from './dto/news.dto';
import { NewsSaveDto } from './dto/news.save-dto';
import { NewsUpdateDto } from './dto/news.update-dto';
import { Roles } from '../auth/types/auth.decorators';
import { Role } from '../users/enums/role.enum';

@Controller('news')
export class NewsController {
  constructor(private readonly service: NewsService) {}

  @Roles(Role.ADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({
    type: NewsDto,
  })
  async create(@Body() saveDto: NewsSaveDto): Promise<NewsDto> {
    return this.service.create(saveDto);
  }

  @Roles(Role.ADMIN, Role.TRAINER)
  @Get()
  @ApiOkResponse({
    type: NewsDto,
    isArray: true,
  })
  async getAll(): Promise<NewsDto[]> {
    return this.service.getAllNews();
  }

  @Roles(Role.ADMIN, Role.TRAINER)
  @Get(':id')
  @ApiOkResponse({
    type: NewsDto,
  })
  async getById(@Param('id', ParseIntPipe) id: number): Promise<NewsDto> {
    return this.service.getNewsById(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: NewsUpdateDto,
  ): Promise<void> {
    await this.service.update(id, updateDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.deleteById(id);
  }
}
