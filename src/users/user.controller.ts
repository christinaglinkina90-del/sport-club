import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';


import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async create(@Body() user: User): Promise<User> {
    return this.userService.create(user);
  }

  @Get()
  async getAll(): Promise<User[]> {
    return await this.userService.getAllActiveUsers();
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.getActiveUserById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: User,
  ): Promise<void> {
    await this.userService.update(id, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.userService.delete(id);
  }
}
