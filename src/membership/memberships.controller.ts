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
import { MembershipDto } from './dto/membership.dto';
import { MembershipSaveDto } from './dto/membership.save-dto';
import { MembershipUpdateDto } from './dto/membership.update-dto';


@Controller('memberships')
export class MembershipsController {
  constructor(private readonly service: MembershipsService) {}

  @Post()
  async create(@Body() saveDto: MembershipSaveDto): Promise<MembershipDto> {
    return this.service.create(saveDto);
  }

  @Get()
  async getAll(): Promise<MembershipDto[]> {
    return this.service.getAllActiveMemberships();
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<MembershipDto> {
    return this.service.getActiveMembershipById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: MembershipUpdateDto,
  ): Promise<void> {
    await this.service.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.delete(id);
  }
}
