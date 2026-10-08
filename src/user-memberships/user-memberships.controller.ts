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
  Req,
} from '@nestjs/common';
import { UserMembershipsService } from './user-memberships.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { UserMembershipDto } from './dto/user-membership.dto';
import { UserMembershipSaveDto } from './dto/user-membership.save-dto';
import { MyUserMembershipSaveDto } from './dto/my-user-membership.save-dto';
import type { AuthenticatedRequest } from '../auth/types/authenticated-request';
import { MembershipStatus } from './enums/membership-status.enum';
import { Roles } from '../auth/types/auth.decorators';
import { Role } from '../users/enums/role.enum';

@Controller('user-memberships')
export class UserMembershipsController {
  constructor(private readonly service: UserMembershipsService) {}

  // Маршруты /user-memberships/my объявлены раньше /user-memberships/:id,
  // иначе "my" попадёт в параметр :id и ParseIntPipe вернёт 400.
  @Roles(Role.ADMIN, Role.TRAINER, Role.CLIENT)
  @Post('my')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({
    type: UserMembershipDto,
  })
  async requestMy(
    @Body() saveDto: MyUserMembershipSaveDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<UserMembershipDto> {
    return this.service.requestForCurrentUser(request.user, saveDto);
  }

  @Roles(Role.ADMIN, Role.TRAINER, Role.CLIENT)
  @Get('my')
  @ApiOkResponse({
    type: UserMembershipDto,
    isArray: true,
  })
  async getMy(
    @Req() request: AuthenticatedRequest,
  ): Promise<UserMembershipDto[]> {
    return this.service.getActiveUserMembershipsOfUser(request.user);
  }

  @Roles(Role.ADMIN, Role.TRAINER, Role.CLIENT)
  @Patch('my/:id/cancel')
  @HttpCode(HttpStatus.NO_CONTENT)
  async cancelMy(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthenticatedRequest,
  ): Promise<void> {
    await this.service.cancelByCurrentUser(request.user, id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id/confirm')
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirm(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.confirm(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id/reject')
  @HttpCode(HttpStatus.NO_CONTENT)
  async reject(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.reject(id);
  }

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
    return this.service.getAllActiveUserMemberships();
  }

  @Roles(Role.ADMIN, Role.TRAINER)
  @Get(':id')
  @ApiOkResponse({
    type: UserMembershipDto,
  })
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserMembershipDto> {
    return this.service.getActiveUserMembershipById(id);
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

  @Roles(Role.ADMIN)
  @Patch(':id/restore')
  @HttpCode(HttpStatus.NO_CONTENT)
  async restoreById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.restoreById(id);
  }
}
