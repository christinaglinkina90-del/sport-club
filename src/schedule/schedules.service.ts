import { Injectable, Logger } from '@nestjs/common';
import { SchedulesRepository } from './schedules.repository';
import { SchedulesMapper } from './dto/schedules.mapper';
import { Schedule } from './schedule.entity';
import { ScheduleDto } from './dto/schedule.dto';
import { ScheduleSaveDto } from './dto/schedule.save-dto';
import { ScheduleUpdateDto } from './dto/schedule.update-dto';
import { ServicesService } from '../service/services.service';
import { UsersService } from '../users/users.service';
import { SchedulesValidator } from './schedulesValidator/schedulesValidator';

@Injectable()
export class SchedulesService {
  private readonly logger: Logger = new Logger(SchedulesService.name);

  constructor(
    private readonly repository: SchedulesRepository,
    private readonly mapper: SchedulesMapper,
    private readonly servicesService: ServicesService,
    private readonly usersService: UsersService,
    private readonly validator: SchedulesValidator,
  ) {}

  async create(saveDto: ScheduleSaveDto): Promise<ScheduleDto> {
    this.validator.validateSaveDto(saveDto);
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
    this.logger.log(
      `Schedule created: id ${entity.id}, 
      service ${entity.service.id}, 
      trainer ${entity.trainer.id}, 
      date ${entity.date}, 
      time ${entity.startTime}-${entity.endTime}`,
    );

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
    this.validator.validateUpdateDto(updateDto);
    const schedule = await this.getActiveEntityById(id);
    if (updateDto.capacity) schedule.capacity = updateDto.capacity;
    if (updateDto.date) schedule.date = new Date(updateDto.date);
    if (updateDto.startTime) schedule.startTime = updateDto.startTime;
    if (updateDto.endTime) schedule.endTime = updateDto.endTime;
    await this.repository.save(schedule);
    this.logger.log(
      `Schedule updated: id ${id}, 
      date ${schedule.date}, 
      time ${schedule.startTime}-${schedule.endTime}, 
      capacity ${schedule.capacity}`,
    );
  }

  async delete(id: number): Promise<void> {
    const schedule = await this.getActiveEntityById(id);
    schedule.isActive = false;
    await this.repository.save(schedule);
    this.logger.log(`Schedule marked as inactive: id ${id}`);
  }
}
