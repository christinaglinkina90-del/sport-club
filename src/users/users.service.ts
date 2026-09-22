import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './user.entity';
import { Role } from './enum/role.enum';
import { UsersMapper } from './dto/user.mapper';
import { UserDto } from './dto/user.dto';
import { UserSaveDto } from './dto/user.save-dto';
import { UserUpdateDto } from './dto/user.update-dto';
import { UsersValidator } from './validation/users.validator';

@Injectable()
export class UsersService {
  constructor(
    private readonly repository: UsersRepository,
    private readonly mapper: UsersMapper,
    private readonly validator: UsersValidator,
  ) {}

  async create(saveDto: UserSaveDto): Promise<UserDto> {
    this.validator.validateSaveDto(saveDto);
    const entity: User = this.mapper.mapDtoToEntity(saveDto);
    entity.role = Role.CLIENT;
    entity.active = true;
    await this.repository.save(entity);
    return this.mapper.mapEntityToDto(entity)
  }

  async getAllActiveUsers(): Promise<UserDto[]> {
    const users: User[] = await this.repository.findAllActive();
    return this.mapper.mapEntityListToDtoList(users)
  }

  async getActiveUserById(id: number): Promise<UserDto> {
    const user: User = await this.getActiveEntityById(id);

    return this.mapper.mapEntityToDto(user);
  }

  async getActiveEntityById(id: number): Promise<User> {
    const user: User | null = await this.repository.findById(id);
    if (!user || !user.active) {
      throw Error('User with id ${id} not found');
    }
    return user;
  }

  async update(id: number, updateDto: UserUpdateDto): Promise<void> {
    this.validator.validateUpdateDto(updateDto);
    const foundUser: User | null = await this.repository.findById(id);
    if (foundUser) {
      foundUser.name = updateDto.newName;
      await this.repository.save(foundUser);
    }
  }

  async delete(id: number): Promise<void> {
    const user: User | null = await this.getActiveEntityById(id);
    if (!user) {
      throw Error(`User with id ${id} not found`);
    }
    user.active = false;
    await this.repository.save(user);
  }
}
