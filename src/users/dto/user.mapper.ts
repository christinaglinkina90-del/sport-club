import { Injectable } from '@nestjs/common';
import { User } from '../user.entity';
import { UserDto } from './user.dto';
import { UserSaveDto } from './user-save-dto';

@Injectable()
export class UsersMapper {
  mapEntityToDto(entity: User): UserDto{
    const dto: UserDto = new UserDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.role = entity.role;
    return dto;
  }

  mapDtoToEntity(saveDto: UserSaveDto): User {
    const entity: User = new User();
    entity.name = saveDto.name;
    entity.email = saveDto.email;
    entity.password = saveDto.password;
    entity.phone = saveDto.phone;
    return entity;
  }
  mapEntityListToDtoList(entityList: User[]): UserDto[] {
    if (!entityList) {
      return [];
    }
    return entityList.map((u: User): UserDto => this.mapEntityToDto(u));
  }
}