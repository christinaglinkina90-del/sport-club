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
import { ServicesService } from './services.service';
import { ServiceDto } from './dto/service.dto';
import { ServiceSaveDto } from './dto/service.save-dto';
import { ServiceUpdateDto } from './dto/service.update-dto';

@Controller('services')
export class ServicesController {
  constructor(private readonly service: ServicesService) {}

  @Post()
  async create(@Body() saveDto: ServiceSaveDto): Promise<ServiceDto> {
    return this.service.create(saveDto);
  }

  @Get()
  async getAll(): Promise<ServiceDto[]> {
    return this.service.getAllActiveServices();
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<ServiceDto> {
    return this.service.getActiveServiceById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: ServiceUpdateDto,
  ): Promise<void> {
    await this.service.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.delete(id);
  }
}
