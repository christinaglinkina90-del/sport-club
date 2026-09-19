import { Injectable } from '@nestjs/common';
import { Membership } from '../membership.entity';
import { MembershipDto } from './membership.dto';
import { MembershipSaveDto } from './membership.save-dto';

@Injectable()
export class MembershipsMapper {
  mapEntityToDto(entity: Membership): MembershipDto {
    const dto = new MembershipDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.type = entity.type;
    dto.description = entity.description;
    dto.price = entity.price;
    dto.durationInDays = entity.durationInDays;
    return dto;
  }

  mapDtoToEntity(saveDto: MembershipSaveDto): Membership {
    const entity = new Membership();
    entity.name = saveDto.name;
    entity.type = saveDto.type;
    entity.description = saveDto.description;
    entity.price = saveDto.price;
    entity.durationInDays = saveDto.durationInDays;
    return entity;
  }

  mapEntityListToDtoList(entityList: Membership[]): MembershipDto[] {
    if (!entityList) return [];
    return entityList.map((m) => this.mapEntityToDto(m));
  }
}
