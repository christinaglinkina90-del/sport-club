import { Injectable } from '@nestjs/common';
import { UserMembershipSaveDto } from './user-membership.save-dto';
import { UserMembership } from '../user-membership.entity';
import { UserMembershipDto } from './user-membership.dto';
import { UsersMapper } from '../../users/dto/users.mapper';
import { MembershipsMapper } from '../../memberships/dto/memberships.mapper';

@Injectable()
export class UserMembershipsMapper {
  constructor(
    private readonly usersMapper: UsersMapper,
    private readonly membershipsMapper: MembershipsMapper,
  ) {}

  mapDtoToEntity(saveDto: UserMembershipSaveDto): UserMembership {
    const entity: UserMembership = new UserMembership();
    entity.status = saveDto.status;
    entity.startDate = saveDto.startDate;
    entity.endDate = saveDto.endDate;
    return entity;
  }

  mapEntityToDto(entity: UserMembership): UserMembershipDto {
    const dto: UserMembershipDto = new UserMembershipDto();
    dto.id = entity.id;
    dto.user = this.usersMapper.mapEntityToDto(entity.user);
    dto.membership = this.membershipsMapper.mapEntityToDto(entity.membership);
    dto.status = entity.status;
    dto.startDate = entity.startDate;
    dto.endDate = entity.endDate;
    return dto;
  }

  mapEntityListToDtoList(entityList: UserMembership[]): UserMembershipDto[] {
    if (!entityList) {
      return [];
    }
    return entityList.map((x: UserMembership): UserMembershipDto =>
      this.mapEntityToDto(x),
    );
  }
}
