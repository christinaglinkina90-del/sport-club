import { Injectable } from '@nestjs/common';
import { MembershipSaveDto } from './membership.save-dto';
import { Membership } from '../membership.entity';
import { MembershipDto } from './membership.dto';

@Injectable()
export class MembershipsMapper {
  mapDtoToEntity(saveDto: MembershipSaveDto): Membership {
    const entity: Membership = new Membership();
    entity.name = saveDto.name;
    entity.type = saveDto.type;
    entity.description = saveDto.description;
    entity.price = saveDto.price;
    entity.durationInDays = saveDto.durationInDays;
    return entity;
  }

  mapEntityToDto(entity: Membership): MembershipDto {
    const dto: MembershipDto = new MembershipDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.type = entity.type;
    dto.description = entity.description;
    dto.price = Number(entity.price);
    dto.durationInDays = entity.durationInDays;
    return dto;
  }

  mapEntityListToDtoList(entityList: Membership[]): MembershipDto[] {
    if (!entityList) {
      return [];
    }
    return entityList.map((x: Membership): MembershipDto =>
      this.mapEntityToDto(x),
    );
  }
}
