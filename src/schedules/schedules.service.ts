import { Injectable, Logger } from '@nestjs/common';
import { Schedule } from './schedule.entity';
import { SchedulesRepository } from './schedules.repository';
import { SchedulesMapper } from './dto/schedules.mapper';
import { ScheduleSaveDto } from './dto/schedule.save-dto';
import { ScheduleDto } from './dto/schedule.dto';
import { ScheduleUpdateDto } from './dto/schedule.update-dto';
import { SchedulesValidator } from './validation/schedules.validator';
import { ServicesService } from '../services/services.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { Role } from '../users/enums/role.enum';
import { RoleMismatchException } from '../exceptions/types/role-mismatch.exception';
import { EntityNotFoundException } from '../exceptions/types/entity-not-found.exception';
import { EntityUpdateException } from '../exceptions/types/entity-update.exception';

@Injectable()
export class SchedulesService {
  private readonly logger: Logger = new Logger(SchedulesService.name);

  constructor(
    private readonly repository: SchedulesRepository,
    private readonly servicesService: ServicesService,
    private readonly usersService: UsersService,
    private readonly mapper: SchedulesMapper,
    private readonly validator: SchedulesValidator,
  ) {}

  async create(saveDto: ScheduleSaveDto): Promise<ScheduleDto> {
    this.validator.validateSaveDto(saveDto);
    const entity: Schedule = this.mapper.mapDtoToEntity(saveDto);

    const trainer: User = await this.usersService.getActiveEntityById(
      saveDto.trainerId,
    );

    if (trainer.role !== Role.TRAINER) {
      throw new RoleMismatchException(saveDto.trainerId, Role.TRAINER);
    }

    entity.trainer = trainer;
    entity.service = await this.servicesService.getActiveEntityById(
      saveDto.serviceId,
    );

    entity.active = true;
    await this.repository.save(entity);

    this.logger.log(
      `Schedule created: id ${entity.id}, service id ${entity.service.id}, trainer id ${entity.trainer.id}`,
    );

    return this.mapper.mapEntityToDto(entity);
  }

  async getAllActiveSchedules(): Promise<ScheduleDto[]> {
    const schedules: Schedule[] = await this.repository.findAllActive();

    if (schedules.length === 0) {
      throw new EntityNotFoundException(Schedule.name);
    }

    return this.mapper.mapEntityListToDtoList(schedules);
  }

  async getActiveScheduleById(id: number): Promise<ScheduleDto> {
    const schedule: Schedule = await this.getActiveEntityById(id);
    return this.mapper.mapEntityToDto(schedule);
  }

  async getActiveEntityById(id: number): Promise<Schedule> {
    const schedule: Schedule | null = await this.repository.findById(id);

    if (!schedule || !schedule.active) {
      throw new EntityNotFoundException(Schedule.name, id);
    }

    return schedule;
  }

  async update(id: number, updateDto: ScheduleUpdateDto): Promise<void> {
    this.validator.validateUpdateDto(updateDto);
    const foundSchedule: Schedule = await this.getActiveEntityById(id);

    if (updateDto.newDate) {
      foundSchedule.date = updateDto.newDate;
    }

    if (updateDto.newStartTime) {
      foundSchedule.startTime = updateDto.newStartTime;
    }

    if (updateDto.newEndTime) {
      foundSchedule.endTime = updateDto.newEndTime;
    }

    if (updateDto.newCapacity) {
      foundSchedule.capacity = updateDto.newCapacity;
    }

    if (foundSchedule.endTime <= foundSchedule.startTime) {
      throw new EntityUpdateException(
        `Schedule id ${id}: end time should be later than start time`,
      );
    }

    await this.repository.save(foundSchedule);

    this.logger.log(
      `Schedule updated: id ${id}, time ${foundSchedule.startTime}-${foundSchedule.endTime}, capacity ${foundSchedule.capacity}`,
    );
  }

  async deleteById(id: number): Promise<void> {
    const schedule: Schedule = await this.getActiveEntityById(id);
    schedule.active = false;
    await this.repository.save(schedule);

    this.logger.log(`Schedule marked as inactive: id ${id}`);
  }

  async restoreById(id: number): Promise<void> {
    const schedule: Schedule | null = await this.repository.findById(id);

    if (!schedule) {
      throw new EntityNotFoundException(Schedule.name, id);
    }

    if (!schedule.active) {
      schedule.active = true;
      await this.repository.save(schedule);

      this.logger.log(`Schedule marked as active: id ${id}`);
    }
  }
}
