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
import { MembershipsService } from './memberships.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { MembershipDto } from './dto/membership.dto';
import { MembershipSaveDto } from './dto/membership.save-dto';
import { MembershipUpdateDto } from './dto/membership.update-dto';
import { Roles } from '../auth/types/auth.decorators';
import { Role } from '../users/enums/role.enum';

@Controller('memberships')
export class MembershipsController {
  constructor(private readonly service: MembershipsService) {}

  @Roles(Role.ADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({
    type: MembershipDto,
  })
  async create(@Body() saveDto: MembershipSaveDto): Promise<MembershipDto> {
    return this.service.create(saveDto);
  }

  @Roles(Role.ADMIN, Role.TRAINER)
  @Get()
  @ApiOkResponse({
    type: MembershipDto,
    isArray: true,
  })
  async getAll(): Promise<MembershipDto[]> {
    return this.service.getAllActiveMemberships();
  }

  @Roles(Role.ADMIN, Role.TRAINER)
  @Get(':id')
  @ApiOkResponse({
    type: MembershipDto,
  })
  async getById(@Param('id', ParseIntPipe) id: number): Promise<MembershipDto> {
    return this.service.getActiveMembershipById(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: MembershipUpdateDto,
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
}
