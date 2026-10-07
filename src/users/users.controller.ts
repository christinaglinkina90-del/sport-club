import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Role } from './enums/role.enum';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { UserSaveDto } from './dto/user.save-dto';
import { UserUpdateDto } from './dto/user.update-dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { Roles } from '../auth/types/auth.decorators';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Roles(Role.ADMIN, Role.TRAINER)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({
    type: UserDto,
  })
  async create(@Body() saveDto: UserSaveDto): Promise<UserDto> {
    return this.service.create(saveDto);
  }

  @Roles(Role.ADMIN, Role.TRAINER)
  @Get()
  @ApiOkResponse({
    type: UserDto,
    isArray: true,
  })
  async getAll(): Promise<UserDto[]> {
    return this.service.getAllActiveUsers();
  }

  @Roles(Role.ADMIN, Role.TRAINER)
  @Get(':id')
  @ApiOkResponse({
    type: UserDto,
  })
  async getById(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
    return this.service.getActiveUserById(id);
  }

  @Roles(Role.ADMIN, Role.TRAINER)
  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UserUpdateDto,
  ): Promise<void> {
    await this.service.update(id, updateDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.deleteById(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id/restore')
  @HttpCode(HttpStatus.NO_CONTENT)
  async restoreById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.restoreById(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id/set-role/:role')
  @HttpCode(HttpStatus.NO_CONTENT)
  async setRole(
    @Param('id', ParseIntPipe) id: number,
    @Param('role', new ParseEnumPipe(Role)) role: Role,
  ): Promise<void> {
    await this.service.setRole(id, role);
  }
}
