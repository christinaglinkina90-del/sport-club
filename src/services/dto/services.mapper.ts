import { Injectable } from '@nestjs/common';
import { ServiceSaveDto } from './service.save-dto';
import { Service } from '../service.entity';
import { ServiceDto } from './service.dto';

@Injectable()
export class ServicesMapper {
  mapDtoToEntity(saveDto: ServiceSaveDto): Service {
    const entity: Service = new Service();
    entity.name = saveDto.name;
    entity.type = saveDto.type;
    entity.description = saveDto.description;
    entity.price = saveDto.price;
    return entity;
  }

  mapEntityToDto(entity: Service): ServiceDto {
    const dto: ServiceDto = new ServiceDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.type = entity.type;
    dto.description = entity.description;
    dto.price = Number(entity.price);
    return dto;
  }

  mapEntityListToDtoList(entityList: Service[]): ServiceDto[] {
    if (!entityList) {
      return [];
    }
    return entityList.map((x: Service): ServiceDto => this.mapEntityToDto(x));
  }
}
