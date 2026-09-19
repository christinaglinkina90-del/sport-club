import { UserMembershipSaveDto } from './user-membership.save-dto';
import { UserMembership } from '../user-membership.entity';
import { UserMembershipDto } from './user-membership.dto';
import { UsersMapper } from '../../users/dto/user.mapper';
import { User } from '../../users/user.entity';
import { Membership } from '../../membership/membership.entity';
import { MembershipsMapper } from '../../membership/dto/memberships.mapper';


export class UserMembershipMapper {
  constructor(
    private readonly usersMapper: UsersMapper,
    private readonly memberShipMapper: MembershipsMapper,
  ) {}

  mapDtoToEntity(
    saveDto: UserMembershipSaveDto,
    user: User,
    membership: Membership,
  ): UserMembership {
    const entity: UserMembership = new UserMembership();
    entity.user = user;
    entity.membership = membership;
    entity.status = saveDto.status;
    entity.startDate = saveDto.startDate;
    entity.endDate = saveDto.endDate;
    return entity;
  }

  mapEntityToDto(entity: UserMembership): UserMembershipDto {
    const dto: UserMembershipDto = new UserMembershipDto();
    dto.id = entity.id;
    dto.user = this.usersMapper.mapEntityToDto(entity.user);
    dto.membership = this.memberShipMapper.mapEntityToDto(entity.membership);
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