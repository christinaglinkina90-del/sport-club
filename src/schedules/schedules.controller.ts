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
import { ApiOkResponse } from '@nestjs/swagger';
import { ScheduleDto } from './dto/schedule.dto';
import { ScheduleSaveDto } from './dto/schedule.save-dto';
import { ScheduleUpdateDto } from './dto/schedule.update-dto';
import { Roles } from '../auth/types/auth.decorators';
import { Role } from '../users/enums/role.enum';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly service: SchedulesService) {}

  @Roles(Role.ADMIN, Role.TRAINER)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({
    type: ScheduleDto,
  })
  async create(@Body() saveDto: ScheduleSaveDto): Promise<ScheduleDto> {
    return this.service.create(saveDto);
  }

  @Roles(Role.ADMIN, Role.TRAINER, Role.CLIENT)
  @Get()
  @ApiOkResponse({
    type: ScheduleDto,
    isArray: true,
  })
  async getAll(): Promise<ScheduleDto[]> {
    return this.service.getAllActiveSchedules();
  }

  @Roles(Role.ADMIN, Role.TRAINER, Role.CLIENT)
  @Get(':id')
  @ApiOkResponse({
    type: ScheduleDto,
  })
  async getById(@Param('id', ParseIntPipe) id: number): Promise<ScheduleDto> {
    return this.service.getActiveScheduleById(id);
  }

  @Roles(Role.ADMIN, Role.TRAINER)
  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: ScheduleUpdateDto,
  ): Promise<void> {
    await this.service.update(id, updateDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.deleteById(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id/restore')
  @HttpCode(HttpStatus.NO_CONTENT)
  async restoreById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.restoreById(id);
  }
}
