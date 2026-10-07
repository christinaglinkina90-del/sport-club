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
import { UserMembershipsService } from './user-memberships.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { UserMembershipDto } from './dto/user-membership.dto';
import { UserMembershipSaveDto } from './dto/user-membership.save-dto';
import { MembershipStatus } from './enums/membership-status.enum';
import { Roles } from '../auth/types/auth.decorators';
import { Role } from '../users/enums/role.enum';

@Controller('user-memberships')
export class UserMembershipsController {
  constructor(private readonly service: UserMembershipsService) {}

  @Roles(Role.ADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({
    type: UserMembershipDto,
  })
  async create(
    @Body() saveDto: UserMembershipSaveDto,
  ): Promise<UserMembershipDto> {
    return this.service.create(saveDto);
  }

  @Roles(Role.ADMIN, Role.TRAINER)
  @Get()
  @ApiOkResponse({
    type: UserMembershipDto,
    isArray: true,
  })
  async getAll(): Promise<UserMembershipDto[]> {
    return this.service.getAllUserMemberships();
  }

  @Roles(Role.ADMIN, Role.TRAINER)
  @Get(':id')
  @ApiOkResponse({
    type: UserMembershipDto,
  })
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserMembershipDto> {
    return this.service.getUserMembershipById(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id/set-status/:status')
  @HttpCode(HttpStatus.NO_CONTENT)
  async setStatus(
    @Param('id', ParseIntPipe) id: number,
    @Param('status', new ParseEnumPipe(MembershipStatus))
    status: MembershipStatus,
  ): Promise<void> {
    await this.service.setStatus(id, status);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.deleteById(id);
  }
}
