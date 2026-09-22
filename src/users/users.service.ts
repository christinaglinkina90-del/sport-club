import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './user.entity';
import { Role } from './enum/role.enum';
import { UsersMapper } from './dto/user.mapper';
import { UserDto } from './dto/user.dto';
import { UserSaveDto } from './dto/user.save-dto';
import { UserUpdateDto } from './dto/user.update-dto';
import { UsersValidator } from './validation/users.validator';
import { EntitySaveException } from '../exceptions/types/user-save.exception';
import { EntityNotFoundException } from '../exceptions/types/entity-not-found.exception';

@Injectable()
export class UsersService {
  constructor(
    private readonly repository: UsersRepository,
    private readonly mapper: UsersMapper,
    private readonly validator: UsersValidator,
  ) {}

  async create(saveDto: UserSaveDto): Promise<UserDto> {
    if (await this.repository.isEmailExists(saveDto.email)) {
      throw new EntitySaveException(User.name, 'email');
    }

    if (await this.repository.isPhoneExists(saveDto.phone)) {
      throw new EntitySaveException(User.name, 'phone');
    }

    this.validator.validateSaveDto(saveDto);
    const entity: User = this.mapper.mapDtoToEntity(saveDto);
    entity.role = Role.CLIENT;
    entity.active = true;
    await this.repository.save(entity);
    return this.mapper.mapEntityToDto(entity)
  }

  async getAllActiveUsers(): Promise<UserDto[]> {
    const users: User[] = await this.repository.findAllActive();

    if (users.length === 0) {
      throw new EntityNotFoundException(User.name);
    }

    return this.mapper.mapEntityListToDtoList(users)
  }

  async getActiveUserById(id: number): Promise<UserDto> {
    const user: User = await this.getActiveEntityById(id);
    return this.mapper.mapEntityToDto(user);
  }

  async getActiveEntityById(id: number): Promise<User> {
    const user: User | null = await this.repository.findById(id);
    if (!user || !user.active) {
      throw new EntityNotFoundException(User.name, id);
    }
    return user;
  }

  async update(id: number, updateDto: UserUpdateDto): Promise<void> {
    this.validator.validateUpdateDto(updateDto);
    const foundUser: User | null = await this.repository.findById(id);
    if (foundUser) {
      foundUser.name = updateDto.newName;
      await this.repository.save(foundUser);
    } else {
      throw new EntityNotFoundException(User.name, id);
    }
  }

  async delete(id: number): Promise<void> {
    const user: User = await this.getActiveEntityById(id);
    user.active = false;
    await this.repository.save(user);
  }
}
