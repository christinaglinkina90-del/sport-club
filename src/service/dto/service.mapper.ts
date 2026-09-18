import { Injectable } from '@nestjs/common';
import { Service } from '../service.entity';
import { ServiceDto } from './service.dto';
import { ServiceSaveDto } from './service.save-dto';

@Injectable()
export class ServicesMapper {
  mapEntityToDto(entity: Service): ServiceDto {
    const dto = new ServiceDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.description = entity.description;
    dto.price = entity.price;
    dto.type = entity.type;
    return dto;
  }

  mapDtoToEntity(saveDto: ServiceSaveDto): Service {
    const entity = new Service();
    entity.name = saveDto.name;
    entity.description = saveDto.description;
    entity.price = saveDto.price;
    entity.type = saveDto.type;
    return entity;
  }

  mapEntityListToDtoList(entityList: Service[]): ServiceDto[] {
    if (!entityList) return [];
    return entityList.map((s) => this.mapEntityToDto(s));
  }
}
