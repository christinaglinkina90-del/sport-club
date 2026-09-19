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
import { SchedulesService } from './schedules.service';
import { ScheduleDto } from './dto/schedule.dto';
import { ScheduleSaveDto } from './dto/schedule.save-dto';
import { ScheduleUpdateDto } from './dto/schedule.update-dto';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly service: SchedulesService) {}

  @Post()
  async create(@Body() dto: ScheduleSaveDto): Promise<ScheduleDto> {
    return this.service.create(dto);
  }

  @Get()
  async getAll(): Promise<ScheduleDto[]> {
    return this.service.getAllActiveSchedules();
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<ScheduleDto> {
    return this.service.getActiveScheduleById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ScheduleUpdateDto,
  ): Promise<void> {
    await this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.delete(id);
  }
}
