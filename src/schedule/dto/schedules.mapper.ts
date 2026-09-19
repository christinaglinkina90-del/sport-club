import { Injectable } from '@nestjs/common';
import { Schedule } from '../schedule.entity';
import { ScheduleDto } from './schedule.dto';


@Injectable()
export class SchedulesMapper {
  mapEntityToDto(entity: Schedule): ScheduleDto {
    const dto = new ScheduleDto();
    dto.id = entity.id;
    dto.serviceId = entity.service.id;
    dto.trainerId = entity.trainer.id;
    dto.date = entity.date;
    dto.startTime = entity.startTime;
    dto.endTime = entity.endTime;
    dto.capacity = entity.capacity;
    return dto;
  }

  mapEntityListToDtoList(entityList: Schedule[]): ScheduleDto[] {
    if (!entityList) return [];
    return entityList.map((s) => this.mapEntityToDto(s));
  }
}
