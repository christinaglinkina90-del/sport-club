import { Injectable } from '@nestjs/common';
import { ScheduleSaveDto } from './schedule.save-dto';
import { Schedule } from '../schedule.entity';
import { ScheduleDto } from './schedule.dto';
import { UsersMapper } from '../../users/dto/users.mapper';
import { ServicesMapper } from '../../services/dto/services.mapper';

@Injectable()
export class SchedulesMapper {
  constructor(
    private readonly usersMapper: UsersMapper,
    private readonly servicesMapper: ServicesMapper,
  ) {}

  mapDtoToEntity(saveDto: ScheduleSaveDto): Schedule {
    const entity: Schedule = new Schedule();
    entity.date = saveDto.date;
    entity.startTime = saveDto.startTime;
    entity.endTime = saveDto.endTime;
    entity.capacity = saveDto.capacity;
    return entity;
  }

  mapEntityToDto(entity: Schedule): ScheduleDto {
    const dto: ScheduleDto = new ScheduleDto();
    dto.id = entity.id;
    dto.service = this.servicesMapper.mapEntityToDto(entity.service);
    dto.trainer = this.usersMapper.mapEntityToDto(entity.trainer);
    dto.date = entity.date;
    dto.startTime = entity.startTime;
    dto.endTime = entity.endTime;
    dto.capacity = entity.capacity;
    dto.freePlaces =
      entity.bookedCount === undefined
        ? undefined
        : Math.max(entity.capacity - entity.bookedCount, 0);
    return dto;
  }

  mapEntityListToDtoList(entityList: Schedule[]): ScheduleDto[] {
    if (!entityList) {
      return [];
    }
    return entityList.map((x: Schedule): ScheduleDto => this.mapEntityToDto(x));
  }
}
