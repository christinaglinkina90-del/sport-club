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
import { ScheduleService } from './schedule.service.js';
import { ScheduleDto } from './dto/schedule.dto.js';
import { ScheduleSaveDto } from './dto/schedule.save-dto.js';
import { ScheduleUpdateDto } from './dto/schedule.update-dto.js';


@Controller('schedules')
export class ScheduleController
{constructor(private readonly scheduleService: ScheduleService) {}


  @Post()
  async create(@Body() scheduleSaveDto: ScheduleSaveDto): Promise<ScheduleDto>
  {
    return this.scheduleService.create(scheduleSaveDto);
  }


  @Get()
  async getAll(): Promise<ScheduleDto[]> {return this.scheduleService.getAllSchedule();
  }


  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<ScheduleDto | null> {
    return this.scheduleService.getScheduleById(id);
  }



  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateDto:ScheduleUpdateDto): Promise<void> {
  await this.scheduleService.update(id, updateDto);}


  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.scheduleService.deleteById(id);
  }
}
