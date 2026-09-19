import { Body, Controller, Delete, Get, Param, ParseEnumPipe, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { UserMembershipsService } from './user-memberships.service';
import { UserMembershipSaveDto } from './dto/user-membership.save-dto';
import { UserMembershipDto } from './dto/user-membership.dto';
import { NewsUpdateDto } from '../news/dto/news.update-dto';
import { MembershipStatus } from './enum/membership-status.enum';

@Controller('users-memberships')
export class UserMembershipsController {
  constructor(
    private readonly userMembershipService: UserMembershipsService,
  ) {
  }

  @Post()
  async create(userMembershipSaveDto: UserMembershipSaveDto): Promise<UserMembershipDto> {
    return await this.userMembershipService.create(userMembershipSaveDto);
  }

  @Get()
  async getAll(): Promise<UserMembershipDto[]> {
    return this.userMembershipService.getAllUserMemberships();
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<UserMembershipDto> {
    return await this.userMembershipService.getUserMembershipById(id);
  }

  @Delete(':id')
  async deleteById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    this.userMembershipService.deleteById(id);
  }

  @Patch(':id')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Param('membership-status', new ParseEnumPipe(MembershipStatus)) membershipStatus: MembershipStatus,
  ) {
    await this.userMembershipService.update(id, membershipStatus);
  }
}