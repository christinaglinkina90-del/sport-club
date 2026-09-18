import { Injectable } from '@nestjs/common';
import { Schedule } from '../schedule.entity.js';
import { ScheduleDto } from './schedule.dto.js';
import { ScheduleSaveDto } from './schedule.save-dto.js';

@Injectable()
export class ScheduleMapper {
  mapDtoToEntity(saveDto: ScheduleSaveDto): Schedule
  {const entity = new Schedule();
    entity.serviceId = saveDto.serviceId;
    entity.trainerId = saveDto.trainerId;
    entity.date = saveDto.date;
    entity.startTime = saveDto.startTime;
    entity.endTime = saveDto.endTime
    entity.capacity = saveDto.capacity;
    return entity}


  mapEntityToDto(entity: Schedule): ScheduleDto {
    const dto = new ScheduleDto();
    dto.id = entity.id;
    dto.serviceId = entity.serviceId;
    dto.trainerId = entity.trainerId;
    dto.date = entity.date;
    dto.startTime = entity.startTime;
    dto.endTime = entity.endTime;
    dto.capacity = entity.capacity;
    return dto
  }


  mapEntityListToDtoList(entityList: Schedule[]): ScheduleDto[] {
    if (!entityList) {return[]}

    return entityList.map((entity) => this.mapEntityToDto(entity));
  }
}
