import { Injectable } from '@nestjs/common';
import { User } from '../user.entity';
import { UserDto } from './user.dto';
import { UserSaveDto } from './user.save-dto';
import { UserDetailsDto } from './user-details.dto';

@Injectable()
export class UsersMapper {
  mapEntityToDto(entity: User): UserDto {
    if (!entity) {
      return new UserDto();
    }

    const dto: UserDto = new UserDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.role = entity.role;
    return dto;
  }

  mapDtoToEntity(saveDto: UserSaveDto): User {
    const entity: User = new User();
    entity.email = saveDto.email;
    entity.password = saveDto.password;
    entity.name = saveDto.name;
    entity.phone = saveDto.phone;
    return entity;
  }

  mapEntityListToDtoList(entityList: User[]): UserDto[] {
    return entityList.map((u: User): UserDto => this.mapEntityToDto(u));
  }

  mapEntityToDetailsDto(entity: User): UserDetailsDto {
    const dto: UserDetailsDto = new UserDetailsDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.email = entity.email;
    dto.phone = entity.phone;
    dto.role = entity.role;
    dto.active = entity.active;
    return dto;
  }

  mapEntityListToDetailsDtoList(entityList: User[]): UserDetailsDto[] {
    return entityList.map((u: User): UserDetailsDto =>
      this.mapEntityToDetailsDto(u),
    );
  }
}
