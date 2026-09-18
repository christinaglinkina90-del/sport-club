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


import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { UserSaveDto } from './dto/user.save-dto';
import { UserUpdateDto } from './dto/user.update-dto';


@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async create(@Body() saveDto: UserSaveDto): Promise<UserDto> {
   return this.userService.create(saveDto)
  }

  @Get()
  async getAll(): Promise<UserDto[]> {
    return await this.userService.getAllActiveUsers();
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
    return this.userService.getActiveUserById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() upDateDto: UserUpdateDto,
  ): Promise<void> {
    await this.userService.update(id, upDateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.userService.delete(id);
  }
}
