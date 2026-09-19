import { Injectable } from '@nestjs/common';
import { SchedulesRepository } from './schedules.repository';
import { SchedulesMapper } from './dto/schedules.mapper';
import { Schedule } from './schedule.entity';
import { ScheduleDto } from './dto/schedule.dto';
import { ScheduleSaveDto } from './dto/schedule.save-dto';
import { ScheduleUpdateDto } from './dto/schedule.update-dto';
import { ServicesService } from '../service/services.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class SchedulesService {
  constructor(
    private readonly repository: SchedulesRepository,
    private readonly mapper: SchedulesMapper,
    private readonly servicesService: ServicesService,
    private readonly usersService: UsersService,
  ) {}

  async create(saveDto: ScheduleSaveDto): Promise<ScheduleDto> {
    const service = await this.servicesService.getActiveEntityById(
      saveDto.serviceId,
    );
    const trainer = await this.usersService.getActiveEntityById(
      saveDto.trainerId,
    );

    const entity = new Schedule();
    entity.service = service;
    entity.trainer = trainer;
    entity.date = new Date(saveDto.date);
    entity.startTime = saveDto.startTime;
    entity.endTime = saveDto.endTime;
    entity.capacity = saveDto.capacity;
    entity.isActive = true;

    await this.repository.save(entity);
    return this.mapper.mapEntityToDto(entity);
  }

  async getAllActiveSchedules(): Promise<ScheduleDto[]> {
    const schedules = await this.repository.findAllActive();
    return this.mapper.mapEntityListToDtoList(schedules);
  }

  async getActiveScheduleById(id: number): Promise<ScheduleDto> {
    const schedule = await this.getActiveEntityById(id);
    return this.mapper.mapEntityToDto(schedule);
  }

  async getActiveEntityById(id: number): Promise<Schedule> {
    const schedule = await this.repository.findById(id);
    if (!schedule || !schedule.isActive) {
      throw new Error(`Schedule with id ${id} not found`);
    }
    return schedule;
  }

  async update(id: number, updateDto: ScheduleUpdateDto): Promise<void> {
    const schedule = await this.getActiveEntityById(id);
    if (updateDto.capacity) schedule.capacity = updateDto.capacity;
    if (updateDto.date) schedule.date = new Date(updateDto.date);
    if (updateDto.startTime) schedule.startTime = updateDto.startTime;
    if (updateDto.endTime) schedule.endTime = updateDto.endTime;
    await this.repository.save(schedule);
  }

  async delete(id: number): Promise<void> {
    const schedule = await this.getActiveEntityById(id);
    schedule.isActive = false;
    await this.repository.save(schedule);
  }
}
